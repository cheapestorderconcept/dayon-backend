
const mongoose = require('mongoose');

const joi = require('joi');


const productFieldValidation = joi.object({
  product_name: joi.string().required(),
  product_price: joi.number().required(),
  product_barcode: '',
  current_product_quantity: joi.number().required(),
  selling_price: '',
  product_brand: joi.string().required(),
  supplier: joi.string().required(),
});

const transferValidation = joi.object({
    sendingProductId: joi.string().required(),
    receivingProductId: joi.string().required(),
    sendingBranchId: joi.string().required(),
    receivingBranchId: joi.string().required(),
    quantity:joi.any().required(),
    transferBy: joi.string().required(),
    sendingBranchName: joi.string().required(),
    receivingBranchName: joi.string().required(),
    sentProductName: joi.string().required(),
    receivingProductName: joi.string().required(),
    transferDate: joi.date().required()
})

const productSchema = new mongoose.Schema({
  product_name: {type: String, required:true},
  product_price: {type:Number, required:true},
  product_barcode:{type:String},
  selling_price:{type:String},
  current_product_quantity:{type:Number},
  previous_product_quantity: {type: Number, default:0},
  branch: {type: String}, 
  product_brand: {type: String},
  supplier: {type: String,},
  
});
const productTransferHistory = new mongoose.Schema({
    sendingBranchId: {type: String}, 
    receivingBranchId :{type: String},
    sendingBranchName: {type:String},
    receivingBranchName:{type:String},
    note: {type:String},
    transferBy: {type:String},
    transferDate: {type:Date},
  
  });



productSchema.statics.createProduct = function createProduct(mproduct){
    return new product(mproduct)
}


function productPreSaveHook(data){
    productSchema.pre('save', async function(done){
        const {branch_id} = data;
        this.set('branch',branch_id);
        done()
    });
}


productSchema.statics.getTransferHistory=async function getTransferHistory(id, page, perPage) {
    return await transferHistory.find({
        $or:[
            {sendingBranchId:id},
            {receivingBranchId:id}
        ]
    }).sort({_id:-1})
    .skip(page!=null?Number(page-1)*Number(perPage):(1-1)*Number(perPage))
    .limit(perPage??40);
}

productSchema.statics.findProducts = async function findProducts(branch){
    const mproduct = await product.find({branch})
    return mproduct;
}
productSchema.statics.findById = async function findById(productId,){
    const mproduct = await product.findOne({_id:productId});
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

productSchema.statics.transferProduct = async function transferProduct(
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
){
    const note =`
    ${quantity} quantities of ${sentProductName} transfer to ${receivingProductName}
    between ${sendingBranchName} and ${receivingBranchName}                    
    `;
    const [a,b,c] = await Promise.all([
        product.findOneAndUpdate({_id:sendingProductId,},{$inc:{ current_product_quantity:Number(-quantity)}}),
        product.findOneAndUpdate({_id:receivingProductId,},{$inc: {current_product_quantity:Number(quantity)}}),
        new transferHistory({
            sendingBranchId,
            receivingBranchId,
            note: note.trim(),
            transferBy,
            sendingBranchName,
            receivingBranchName,
            transferDate
        })
    ]);
    return c.save()
}

productSchema.statics.manageProductSales = async function manageProductSales(product_barcode, data, branch){
    const mproduct = await product.findOneAndUpdate({product_barcode, branch},data);
    return mproduct;
}

const product = mongoose.model('product', productSchema);

const transferHistory= mongoose.model('ProductTransferHistory',productTransferHistory)

module.exports={
    productFieldValidation,
    transferValidation,
    productPreSaveHook,
    product,
    transferHistory
}