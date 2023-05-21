
const mongoose = require('mongoose');

const appStatusSchema = new mongoose.Schema({
    isActive: {type: Boolean, default: true},
    company_email: {type: String, require: true },
});

const AppStatusModel = mongoose.model('app-status', appStatusSchema);
module.exports= {
    AppStatusModel
}