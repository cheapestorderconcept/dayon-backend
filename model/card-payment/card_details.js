const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    last4: {type: String, required:true},
    authorization_code: {type: String, required:true},
    card_type: {type: String, required:true},
});
cardSchema.statics.addCard =  function addCard(card_details){
    return new cardModel(card_details);
    
}
cardSchema.statics.getCards =async function getCards(){
    const branch = await  cardModel.find({});
    return branch;
}
const cardModel = mongoose.model('card-detail', cardSchema);


module.exports={
 cardModel
}