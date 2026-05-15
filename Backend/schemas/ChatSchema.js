const mongoose= require('mongoose');
const chatSchema = new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId, ref:'user',required:true}],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message',
    },
   
    },{timestamps:true}
);

module.exports = {
    chatSchema
}