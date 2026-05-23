const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    text:{
        type:String,
        required:true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, { timestamps: true });

module.exports={
    messageSchema
}