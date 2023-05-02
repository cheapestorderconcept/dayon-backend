


/***When adding sales, the product level should be decreasing */
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { customerRecord } = require("../../model/customer/customer-txn-list");
const { product } = require("../../model/products/products");
const { salesFieldValidation, Sales, } = require("../../model/sales/sales");

async function findProduct(id, branch_id){
    const prodcutById = await product.findOne({_id: id, branch:branch_id})
     return prodcutById;
   }

   async function updateProduct(id, branch_id,data){
    const mproduct = await product.findOneAndUpdate({_id:id,branch:branch_id},data);
    if (mproduct) {
     return mproduct;
    }
   }

const addSales = async(req,res,next)=>{
    try {  
        const {branch_id} = req.userData;
        let returnArray = [];
       const mSales = await salesFieldValidation.validateAsync(req.body); 
       const doesSalesExist =await Sales.findSingleSales(mSales.invoice_number,branch_id);
       if (doesSalesExist) {
         const e = new HttpError(400, "A sales already existed with this invoice number.");
         return next(e);  
       }   
       for (let index = 0; index < mSales.items.length; index++) {
        if(mSales.items[index].quantity<1){
            const e = new HttpError(400, "One of your items has zero has quantity. Quantity must be greater or equals 1");
             return next(e);  
           }
         const mproduct =await findProduct(mSales.items[index]._id,branch_id);
                if (mproduct) {
                    const datas = {
                        current_product_quantity: Number(mproduct.current_product_quantity) -Number(mSales.items[index].quantity),
                        previous_product_quantity: Number(mproduct.current_product_quantity)
                    }  
                    if (mSales.items[index].quantity <= mproduct.current_product_quantity) {
                        await updateProduct(mproduct._id,branch_id,datas);
                        const data = {
                            invoice_number:mSales.invoice_number,
                            created_at: `${mSales.created_at}Z`,
                            payment_type:mSales.payment_type,
                            customer_id: mSales.customer_id,
                            branch: mSales.branch, //add at backend
                            product_id: mSales.items[index]._id,
                            cost_price: mproduct.product_price,
                            product_name: mproduct.product_name,
                            quantity: mSales.items[index].quantity,
                            barcode: mproduct.product_barcode,
                            selling_price:  mproduct.selling_price,
                            selectedProduct:mSales.items[index].selectedProduct,
                            product: mSales.items[index].product_name,
                            amount: mproduct.selling_price * mSales.items[index].quantity,
                        
                        }
                        if (mSales.customer_id && mSales.customer_id !='') {
                            const existingRecord = await customerRecord.findRecord(mSales.customer_id);
                            const {total_purchased,total_amount_paid}= existingRecord;
                            const data ={
                             total_amount_paid: total_amount_paid + Number(mSales.items[index].amount),
                             total_purchased: total_purchased + Number(mSales.items[index].amount),
                             net_balance: total_purchased - total_amount_paid
                            }
                          await customerRecord.updateRecord(mSales.customer_id,data)
                        }
                        const addNewSales = Sales.createSales(data);
                        addNewSales.save().then((savedProduct)=>{
                            returnArray[index] = {product_name: '', product_price: 0}
                            if (Object.keys(returnArray).length==mSales.items.length) {
                                httpResponse({status_code:200, response_message:'Sales successfully added',data:savedProduct,res});
                            }

                        })
                       }else{
                        const e = new HttpError(400, "Out of stock");
                        return next(e);  
                       }
                }else{
                    const e = new HttpError(400, "No product found");
                    return next(e);
                }
       }  
    } catch (error) {
      joiError(error,next);  
    }
}


module.exports={
    addSales
}


