

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({

    total_purchased: {type: Number, default: 0},

    total_amount_paid: {type:Number, default:0},

    net_balance: {type: Number, default: 0},

    customer: {type:mongoose.Types.ObjectId, ref:'customer'}

})



recordSchema.statics.createNewRecord = async function createNewRecord(customer){
    const newRec = await  new customerRecord({
        customer
    })

    const created = newRec.save();
    return created;
}

recordSchema.statics.updateRecord = async function updateRecord(customerId, data) {
    const record = customerRecord.findOneAndUpdate({customer:customerId}, data);
    return record;
}
recordSchema.statics.findRecord = async function findRecord(customerId,data) {
    const record =await customerRecord.findOne({customer:customerId}, data);
    return record;
}
recordSchema.statics.viewCustomerHistory = async function viewGistory(customerId,branch) {
        const history = await customerRecord.findOne({customer:customerId, branch});
        return history;
}

const customerRecord = mongoose.model('customer-record', recordSchema);

module.exports={
    customerRecord
}