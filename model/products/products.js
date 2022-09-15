
const mongoose = require('mongoose');

const joi = require('joi');


const productFieldValidation = joi.object({
  product_name: joi.string().required(),
  product_price: joi.number().required(),
  product_barcode: '',
  current_product_quantity: joi.any(),
  selling_price: '',
  product_brand: joi.string().required(),
  supplier: joi.string().required(),
});

const productSchema = new mongoose.Schema({
  product_name: {type: String, required:true},
  product_price: {type:Number, required:true},
  product_barcode:{type:String},
  selling_price:{type:String},
  current_product_quantity:{type:Number},
  previous_product_quantity: {type: Number, default:0},
  branch: {type: String}, 
  product_brand: {type: String},
  supplier: {type: String, required:true}
});



productSchema.statics.createProduct = function createProduct(mproduct){
    return new product(mproduct)
}


function productPreSaveHook(data){
    // console.log(data);
    productSchema.pre('save', async function(done){
        const {branch_id} = data;
        this.set('branch',branch_id);
        done()
    });
}



productSchema.statics.findProducts = async function findProducts(branch){
    const mproduct = await product.find({branch})
    return mproduct;
}

productSchema.statics.findProduct = async function findProduct(productId,branch){
    const mproduct = await product.findOne({_id:productId,branch});
    return mproduct;
}

productSchema.statics.findProductByBarcode = async function findProductByBarcode(product_barcode, branch){
    const mproduct = await product.findOne({product_barcode, branch});
    return mproduct;
}

productSchema.statics.deleteProduct = async function(productId){
    const mproduct = await product.findOneAndDelete({_id:productId});
    return mproduct;
}
productSchema.statics.updateProduct = async function updateProduct(productId, data){
    const mproduct = await product.findOneAndUpdate({_id:productId},data);
    return mproduct;
}

productSchema.statics.manageProductSales = async function manageProductSales(product_barcode, data, branch){
    const mproduct = await product.findOneAndUpdate({product_barcode, branch},data);
    return mproduct;
}

const product = mongoose.model('product', productSchema);


module.exports={
    productFieldValidation,
    productPreSaveHook,
    product
}