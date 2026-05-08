const mongoose= require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  bio:{
    type:String,
    
  },
  reputationStars: { 
    type: Number, 
    default: 0 
  },
  profilePic: { 
    type: String, 
    default: "default-avatar.png" 
  }
}, { timestamps: true }); 

userSchema.pre('save', async function() {
  // If password isn't modified, just return (exit the function)
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = {
    userSchema
};
