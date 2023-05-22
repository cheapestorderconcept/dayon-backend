const mongoose = require('mongoose');

const paymentAttemptSchema = new mongoose.Schema({
     failed_atempts_counts: {type:Number}
});

const PaymentAttemptModel = mongoose.model('payment-attempt', paymentAttemptSchema);

module.exports ={
 PaymentAttemptModel
}