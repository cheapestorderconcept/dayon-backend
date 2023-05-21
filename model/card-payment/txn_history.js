const mongoose = require('mongoose');
const cardTxnSchema = new mongoose.Schema({
    amount_paid: {type:Number, required: true},
    customer_email: {type:String},
    reference: {type:String, required: true},
    status: {type:String},
});

cardTxnSchema.statics.addTransaction =  function addTransaction(txn){
    return new cardTransactionModel(txn);
    
}
cardTxnSchema.statics.getTransactions =async function getTransactions(){
    const branch = await  cardTransactionModel.find({});
    return branch;
}

cardTxnSchema.statics.getFailedTransactions =async function getFailedTransactions(){
    const branch = await  cardTransactionModel.find({status:'failed'});
    return branch;
}
const cardTransactionModel = mongoose.model('software-payment', cardTxnSchema);
module.exports ={
    cardTransactionModel
}

