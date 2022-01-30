const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { product } = require("../../model/products/products")




const viewAllProducts = async(req,res,next)=>{
    try {
        const mProducts = await product.findProducts();
        const {current_branch} = req.userData;
        const branchProduct = mProducts.filter(p=>p.branch==current_branch);
        if (mProducts) {
          httpResponse({status_code:200,response_message:'Product fetched',data:branchProduct,res}); 
        }
    } catch (error) {
        const err = new HttpError(500, error.message);
        return next(err);
    }
}

const viewSingleProduct = async(req,res,next)=>{
    try {
      const {product_barcode} = req.params;
      if (!product_barcode) {
        const err = new HttpError(400, 'Please supply product barcode');
        return next(err);
      }  
      const mProduct = await product.findProductByBarcode(product_barcode);
      if (mProduct) {
        httpResponse({status_code:200, response_message:'Product available',data:mProduct,res});  
      }else{
        const err = new HttpError(400, 'No product found for product barcode');
        return next(err);   
      }
    } catch (error) {
        const err = new HttpError(500, error.message);
        return next(err);
    }
}


module.exports={
    viewAllProducts,
    viewSingleProduct
}