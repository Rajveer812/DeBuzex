const mongoose= require('mongoose');
const bcrypt=require('bcryptjs');

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    platform:{
        type:String,enum:['Android','Ios','MacOS','Windows','Linux'],
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'user',
        required:true,
    },
    isResolved:{
        type:Boolean,
        default:false,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    solutions: [{
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

module.exports={
    postSchema
}