const mongoose=require('mongoose');
const {userSchema}=require('../schemas/userSchema');

const userModel=mongoose.model("user",userSchema);

module.exports={userModel};