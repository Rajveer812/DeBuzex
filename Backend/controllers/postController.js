const {postModel}=require('../models/postModel');
const { userModel } = require('../models/userModel');

const createPost=async (req,res)=>{
    try{
        const {title,description,platform}=req.body;
        if (!title || !description || !platform) {
            return res.status(400).json({ message: "Please provide a title, description, and platform." });
        }

        // Extract image URLs from Cloudinary upload
        const images = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                images.push(file.path);
            });
        }

        const newPost=await postModel.create({
            title,
            description,
            platform,
            author: req.user._id,
            images
        });
        res.status(201).json(newPost)
    }
    catch(error){
        console.log("Error creating Post",error);
        res.status(500).json({message:"Server error while creating post"})
    }
};

const getAllPosts=async(req,res)=>{
    try{
        const posts=await postModel.find()
        .sort({createdAt:-1})
        .populate('author','name username profilePic')
        .populate('solutions.author', 'name username profilePic');
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

const starSolution = async (req, res) => {
    try {
        const { postId, solutionId } = req.params;
        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const solution = post.solutions.id(solutionId);
        if (!solution) return res.status(404).json({ message: "Solution not found" });

        const { rating } = req.body;
        if (rating === undefined || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const userId = req.user._id;

        // Clean up ALL legacy stars in ALL solutions to prevent Mongoose schema validation errors
        post.solutions.forEach(sol => {
            const sanitizedStars = [];
            for (let i = 0; i < sol.stars.length; i++) {
                const s = sol.stars[i];
                if (s && s.user) {
                    sanitizedStars.push(s);
                } else if (s) {
                    // Legacy string: convert to new object format and default to 5 stars
                    sanitizedStars.push({ user: s, rating: 5 });
                }
            }
            sol.stars = sanitizedStars;
        });

        const existingRatingIndex = solution.stars.findIndex(s => s.user.toString() === userId.toString());
        
        if (existingRatingIndex === -1) {
            solution.stars.push({ user: userId, rating: Number(rating) });
        } else {
            solution.stars[existingRatingIndex].rating = Number(rating);
        }

        await post.save();
        await post.populate('author', 'name username profilePic');
        await post.populate('solutions.author', 'name username profilePic');
        
        res.status(200).json({ message: "Solution star status updated", solutions: post.solutions });
    } catch (error) {
        console.log("Error starring solution:", error);
        res.status(500).json({ message: "Server error starring solution" });
    }
};

const acceptSolution = async (req, res) => {
    try {
        const { postId, solutionId } = req.params;
        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Ensure only the author of the post can accept a solution
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only the post author can accept solutions" });
        }

        const solution = post.solutions.id(solutionId);
        if (!solution) return res.status(404).json({ message: "Solution not found" });

        // Clean up ALL legacy stars in ALL solutions to prevent Mongoose schema validation errors
        post.solutions.forEach(sol => {
            const sanitizedStars = [];
            for (let i = 0; i < sol.stars.length; i++) {
                const s = sol.stars[i];
                if (s && s.user) {
                    sanitizedStars.push(s);
                } else if (s) {
                    // Legacy string: convert to new object format and default to 5 stars
                    sanitizedStars.push({ user: s, rating: 5 });
                }
            }
            sol.stars = sanitizedStars;
        });

        // Toggle accept status
        solution.isAccepted = !solution.isAccepted;

        // If a solution is accepted, mark the post as resolved
        if (solution.isAccepted) {
            post.isResolved = true;
        }

        await post.save();
        await post.populate('author', 'name username profilePic');
        await post.populate('solutions.author', 'name username profilePic');

        res.status(200).json({ message: "Solution acceptance status updated", solutions: post.solutions, isResolved: post.isResolved });
    } catch (error) {
        console.log("Error accepting solution:", error);
        res.status(500).json({ message: "Server error accepting solution" });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userModel.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await postModel.find({ author: user._id })
            .sort({ createdAt: -1 })
            .populate('author', 'name username profilePic')
            .populate('solutions.author', 'name username profilePic');
            
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error fetching user posts:", error);
        res.status(500).json({ message: "Server error fetching user posts" });
    }
};

const getUserSolutions = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await userModel.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await postModel.find({ "solutions.author": user._id })
            .sort({ createdAt: -1 })
            .populate('author', 'name username profilePic')
            .populate('solutions.author', 'name username profilePic');
            
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error fetching user solutions:", error);
        res.status(500).json({ message: "Server error fetching user solutions" });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        // Ensure only the author can delete
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await postModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error deleting post:", error);
        res.status(500).json({ message: "Server error deleting post" });
    }
};

module.exports = { createPost, getAllPosts, likePost, addSolution, starSolution, acceptSolution, getUserPosts, getUserSolutions, deletePost };