const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product, transferValidation } = require("../../model/products/products");



const transferProducts =async function transferProducts(req,res,next){
     try {
        const val = await transferValidation.validateAsync(req.body);
        const productStock = await product.findById(val.sendingProductId);
        if (productStock.current_product_quantity<val.quantity) {
            const err = new HttpError(400, 'You can\'t send above what you have in stock');
            return next(err);  
        }
        if (typeof val.quantity!='number'||!val.quantity) {
            const err = new HttpError(400, 'Quantity must be number');
            return next(err);    
        }
     const {   
        sendingProductId,
        receivingProductId,
        sendingBranchId,
        receivingBranchId,
        quantity,
        transferBy,
        sendingBranchName,
        receivingBranchName,
        sentProductName,
        receivingProductName,
        transferDate
    } = req.body;
        const transferHistory = await product.transferProduct( 
            sendingProductId,
            receivingProductId,
            sendingBranchId,
            receivingBranchId,
            quantity,
            transferBy,
            sendingBranchName,
            receivingBranchName,
            sentProductName,
            receivingProductName,
            transferDate
            );
        if (transferHistory) {
         httpResponse({ status_code: 200, response_message: 'Transfer sucessful', data: transferHistory, res });
        }else{
            const err = new HttpError(400, 'Something went wrong');
            return next(err);
        }
     } catch (error) {
       joiError(error,next)
     }
}

const getTransferHistory = async function getTransferHistory(req,res,next) {
   try {
    const {id,page,perPage}= req.query
    const transferHistory = await product.getTransferHistory(id,page,perPage);
    httpResponse({status_code:200,response_message:'Transfer history',data:{transferHistory},res})
   } catch (error) {
    joiError(error, next);
   } 
}

module.exports={
    transferProducts,
    getTransferHistory
}