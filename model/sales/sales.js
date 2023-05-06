const mongoose = require('mongoose');

const joi = require('joi');

const salesFieldValidation = joi.object({
  invoice_number: joi.string().required(),
  customer_id: joi.any().required(),
  total_amount: joi.any().required(),
  amount_paid: joi.any().required(),
  items: joi.array().min(1).required(),
  total_amount: joi.number().required(),
  branch: joi.string().required(),
  payment_type: joi.string().required(),
  created_at: joi.date().required()
});



const salesSchema = new mongoose.Schema({
   invoice_number:{type: String},
   payment_type: {type:String},
   branch: {type:String}, //add at backend
   barcode: {type:String},
   selling_price: {type:String},
   product_id: {type:String},
   selectedProduct:{type:String},
   product: {type:String},
   cost_price: {type:Number},
   amount: {type: String},
   quantity: {type: String},
   created_at:{type:Date},
   customer_id: {type: String, default:null},
   serial_number: {type:String}
})

salesSchema.statics.createSales = function createSales(sales){
    return new Sales(sales)
}


salesSchema.statics.findSales = async function findsales(){
  const sales = await Sales.find({}).sort({_id:-1}).limit(10);
  return sales;
}

salesSchema.statics.findIndividualCustomerSales = async function findsales(customer_id,branch){
  const sales = await Sales.find({customer_id,branch});
  return sales;
}

salesSchema.statics.findSingleSales = async function findSingleSales(invoice_number,branch){
  const sales = await Sales.findOne({invoice_number,branch});
  return sales;
}


salesSchema.statics.editSales = async function editSales(id,data){
  const sales = await Sales.findOneAndUpdate({_id: id},data);
  return sales;
}


salesSchema.statics.deleteSales = async function deleteSales(id, branch){
  const sales = await Sales.findOneAndDelete({_id:id, branch});
  return sales;
}


const Sales = mongoose.model('sales', salesSchema);


module.exports={
  salesSchema,
    salesFieldValidation,
    Sales,
  
}