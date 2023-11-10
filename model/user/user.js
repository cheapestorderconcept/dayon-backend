
const mongoose = require('mongoose');

const joi = require('joi');
const { hashedPassword } = require('../../middlewares/Authorization/password');

const staffFieldValidation = joi.object({
   first_name: joi.string().required(),
   last_name: joi.string().required(),
   username: joi.string().required().lowercase(),
   email: joi.string().required().email(),
   role: joi.string().required().lowercase(),
   branch: joi.string().required(),
   password: joi.string().required(),
});

const userSchema = new mongoose.Schema({
      first_name: {type: String, required:true},
      last_name: {type: String, required:true},
      username: {type: String, required:true},
      email: {type: String, required:true},
      account_status: {type: String, default:"active"},
      branch: {type:String, required:true},
      role: {type: String, required:true},
      password: {type: String, required:true},
});




userSchema.statics.createUser = function createUser(userDetails){
    const user =  new User(userDetails);
    return user;
}

userSchema.statics.updateUser =async function updateUser(id, data){
    const user =  await User.findByIdAndUpdate({_id:id},data)
    return user;
}

userSchema.statics.deleteUser = async function deleteUser(id){

    const de = await User.findOneAndDelete({_id:id});
    return de;
}

userSchema.pre("save", async function(done){
    const p  =  this.get('password')
     const hashed =await hashedPassword({password:p});
     this.set('password', hashed);
     done()
   });

userSchema.statics.findUserByUserName =async function findUserByUserName(username){
    const user = await User.findOne({username});
    return user;
}
userSchema.statics.findUserById =async function findUserById(id){
    const user = await User.findOne({_id:id});
    return user;
}

userSchema.statics.findStaffs =async function findStaffs(username){
    const staff = await User.find({}).populate('branch');
    return staff;
}

const User = mongoose.model('User', userSchema);
module.exports={
    User,
    staffFieldValidation
}