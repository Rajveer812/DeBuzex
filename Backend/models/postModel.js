const mongoose=require('mongoose');
const {postSchema}=require('../schemas/postSchema');

const postModel=mongoose.model("post",postSchema);

module.exports={postModel}; 