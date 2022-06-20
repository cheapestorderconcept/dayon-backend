


/***When adding sales, the product level should be decreasing */
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { customerRecord } = require("../../model/customer/customer-txn-list");
const { product } = require("../../model/products/products");
const { salesFieldValidation, Sales, } = require("../../model/sales/sales");

async function findProduct(barcode,id, branch_id){
   
    if (typeof barcode !='undefined'&&barcode!=null) {
        console.log(barcode,id, branch_id, 'barcode level');
     const mproduct = await product.findProductByBarcode(barcode,branch_id);
     return mproduct;
    }else{
        console.log(id, branch_id, 'id level');
     const prodcutById = await product.findOne({_id: id, branch:branch_id})
     console.log(prodcutById);
     return prodcutById;
    }
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
         const e = new HttpError(400, "A sales already existed with this invoice number");
         return next(e);  
       }   
       for (let index = 0; index < mSales.items.length; index++) {
         const mproduct =await findProduct(mSales.items[index].barcode, mSales.items[index].product_id,branch_id);
                if (mproduct) {
                    console.log(mproduct);
                    const datas = {
                        current_product_quantity: Number(mproduct.current_product_quantity) -Number(mSales.items[index].quantity),
                        previous_product_quantity: Number(mproduct.current_product_quantity)
                    }  
                    if (mSales.items[index].quantity <= mproduct.current_product_quantity) {
                        const updatedProduct =await updateProduct(mproduct._id,branch_id,datas)
                        const data = {
                            invoice_number:mSales.items[index].invoice_number,
                            created_at: `${mSales.items[index].created_at}Z`,
                            payment_type:mSales.payment_type,
                            customer_id: mSales.customer_id,
                            branch: mSales.branch, //add at backend
                            product_id: mSales.items[index].product_id,
                            cost_price: mproduct.product_price,
                            product_name: mproduct.product_name,
                            quantity: mSales.items[index].quantity,
                            barcode: mSales.items[index].barcode,
                            selling_price:  mSales.items[index].incoming_price!=''?mSales.items[index].incoming_price:service[index].original_price,
                            selectedProduct:mSales.items[index].selectedProduct,
                            product: mSales.items[index].product,
                            amount: mSales.items[index].amount,
                            serial_number: mSales.items[index].serial_number
                        }
                        if (mSales.customer_id) {
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


