const mongoose = require('mongoose');

const txnrecordSchema = new mongoose.Schema({
  customer_fullname: {type:String, },
  customer_current_debt: {type: Number, default: 0},
  invoice_number: {type:String, required:true},
  amount: {type:Number, required:true},
  total_amount_paid: {type:Number, default:0},
  payment_due: {type: Number, default: 0},
  created_at:{type:Date, default: Date.now()},
  customer: {type:mongoose.Types.ObjectId, ref:'customer'}
    
},)

txnrecordSchema.statics.createTxnHistory = async function(history){
    const newRec =  new customerTxnHistory({
        ...history
    })

    const created = newRec.save();
    return created;
}

txnrecordSchema.statics.viewCustomerHistory = async function(customerId){
        const customer = await customerTxnHistory.find({customer: customerId});
        return customer;
    
}


const customerTxnHistory = mongoose.model('customer-txn-history', txnrecordSchema);

module.exports={
    customerTxnHistory
}