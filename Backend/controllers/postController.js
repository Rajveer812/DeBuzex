const {postModel}=require('../models/postModel');
const { userModel } = require('../models/userModel');

const createPost=async (req,res)=>{
    try{
        const {title,description,platform}=req.body;
        if (!title || !description || !platform) {
            return res.status(400).json({ message: "Please provide a title, description, and platform." });
        }
        const newPost=await postModel.create({
            title,
            description,
            platform,
            author: req.user._id
        });
        res.status(201).json('newPost')
    }
    catch(error){
        console.log("Error creating Post",error);
        res.status(500).json({message:"Server error while creating post"})
    }
};

const getAllPosts=async(req,res)=>{
    try{
        const posts=await postModel.find()
        .sort({created:-1})
        .populate('author','name username profilePic');
        res.status(200).json(posts);
    }
    catch(error){
        console.log("Error fetching posts:", error);
        res.status(500).json({ message: "Server error fetching posts." });
    }
}

module.exports={createPost,getAllPosts}