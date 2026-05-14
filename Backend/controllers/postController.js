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

const likePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user already liked the post
        const userId = req.user._id;
        const index = post.likes.indexOf(userId);

        if (index === -1) {
            // Like the post
            post.likes.push(userId);
        } else {
            // Unlike the post
            post.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json({ message: "Post like status updated", likes: post.likes });
    } catch (error) {
        console.log("Error liking post:", error);
        res.status(500).json({ message: "Server error liking post" });
    }
};

const addSolution = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "Solution text is required" });
        }

        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newSolution = {
            text,
            author: req.user._id
        };

        post.solutions.push(newSolution);
        await post.save();

        res.status(201).json({ message: "Solution added successfully", solutions: post.solutions });
    } catch (error) {
        console.log("Error adding solution:", error);
        res.status(500).json({ message: "Server error adding solution" });
    }
};

module.exports = { createPost, getAllPosts, likePost, addSolution };