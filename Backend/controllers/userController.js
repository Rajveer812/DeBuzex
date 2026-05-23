const { userModel } = require('../models/userModel');
const { postModel } = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name, 
        username: user.username,
        email: user.email,
        bio: user.bio,  
        reputationStars: user.reputationStars,
        profilePic: user.profilePic,
        savedPosts: user.savedPosts || [],
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
});

const updateUserProfile =asyncHandler( async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (user) {
      // If the frontend sent a new name/bio, update it. If not, keep the old one.
      user.name = req.body.name || user.name;
      user.username = req.body.username || user.username;
      user.bio = req.body.bio || user.bio;
      
      // If a file was uploaded to Cloudinary, save its URL
      if (req.file) {
          user.profilePic = req.file.path;
      } else if (req.body.profilePic) {
          user.profilePic = req.body.profilePic;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilePic,
        savedPosts: updatedUser.savedPosts || [],
        message: "Profile updated successfully!"
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
});
const getUserByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await userModel.findOne({ username: username });
    
    if (user) {
      // Calculate Stats
      const postsWithSolutions = await postModel.find({ "solutions.author": user._id });

      let solutionsGiven = 0;
      let solutionsAccepted = 0;
      let totalStars = 0; // Sum of all 1-5 ratings
      let totalReviews = 0; // Number of people who gave a rating

      postsWithSolutions.forEach(post => {
          post.solutions.forEach(sol => {
              if (sol.author.toString() === user._id.toString()) {
                  solutionsGiven += 1;
                  if (sol.isAccepted) solutionsAccepted += 1;
                  
                  sol.stars.forEach(star => {
                      totalStars += star.rating;
                      totalReviews += 1;
                  });
              }
          });
      });

      const avgStars = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : 0;

      let rank = "Novice Debugger";
      if (totalStars >= 100) rank = "Grandmaster";
      else if (totalStars >= 40) rank = "Master Debugger";
      else if (totalStars >= 10) rank = "Advanced Debugger";

      // Calculate total posts made by user
      const userPosts = await postModel.find({ author: user._id });
      const postsMade = userPosts.length;

      // Get Global Rank by running the leaderboard pipeline
      const leaderboardData = await postModel.aggregate([
          { $unwind: "$solutions" },
          { $project: {
                  author: "$solutions.author",
                  isAccepted: "$solutions.isAccepted",
                  starsSum: { $reduce: { input: { $ifNull: ["$solutions.stars", []] }, initialValue: 0, in: { $add: ["$$value", { $ifNull: ["$$this.rating", 5] }] } } }
              }
          },
          { $group: { _id: "$author", solutionsAccepted: { $sum: { $cond: ["$isAccepted", 1, 0] } }, totalStars: { $sum: "$starsSum" } } },
          { $sort: { totalStars: -1, solutionsAccepted: -1 } }
      ]);
      const globalRankIndex = leaderboardData.findIndex(data => data._id.toString() === user._id.toString());
      const globalRank = globalRankIndex !== -1 ? globalRankIndex + 1 : "Unranked";
      const totalMembers = await userModel.countDocuments();

      res.json({
        _id: user._id,
        name: user.name, 
        username: user.username,
        bio: user.bio,  
        reputationStars: user.reputationStars,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
        stats: {
          solutionsGiven,
          solutionsAccepted,
          totalStars,
          avgStars,
          rank,
          postsMade,
          globalRank,
          totalMembers
        }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
});

const getLeaderboard = asyncHandler(async (req, res) => {
    // 1. Get all users ranked by their stats. 
    // We use an aggregation pipeline on postModel for high performance.
    const leaderboardData = await postModel.aggregate([
        { $unwind: "$solutions" },
        { 
            $project: {
                author: "$solutions.author",
                isAccepted: "$solutions.isAccepted",
                starsSum: { 
                    $reduce: {
                        input: { $ifNull: ["$solutions.stars", []] },
                        initialValue: 0,
                        in: { $add: ["$$value", { $ifNull: ["$$this.rating", 5] }] } // fallback legacy to 5
                    }
                },
                starsCount: { $size: { $ifNull: ["$solutions.stars", []] } }
            }
        },
        {
            $group: {
                _id: "$author",
                solutionsGiven: { $sum: 1 },
                solutionsAccepted: { $sum: { $cond: ["$isAccepted", 1, 0] } },
                totalStars: { $sum: "$starsSum" },
                totalReviews: { $sum: "$starsCount" }
            }
        },
        { $sort: { totalStars: -1, solutionsAccepted: -1 } },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: "$user._id",
                name: "$user.name",
                username: "$user.username",
                profilePic: "$user.profilePic",
                solutionsGiven: 1,
                solutionsAccepted: 1,
                totalStars: 1,
                totalReviews: 1
            }
        }
    ]);

    // Format avgStars and assign global rank
    const formattedLeaderboard = leaderboardData.map((data, index) => {
        const avgStars = data.totalReviews > 0 ? (data.totalStars / data.totalReviews).toFixed(1) : "0.0";
        return {
            ...data,
            avgStars,
            globalRank: index + 1
        };
    });

    res.status(200).json(formattedLeaderboard);
});

const toggleSavePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const user = await userModel.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if post is already saved
    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
        // Remove from saved posts
        user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    } else {
        // Add to saved posts
        user.savedPosts.push(postId);
    }

    await user.save();
    
    res.status(200).json({ 
        message: isSaved ? "Post removed from saved" : "Post saved successfully",
        savedPosts: user.savedPosts 
    });
});

const getSavedPosts = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id).populate({
        path: 'savedPosts',
        populate: [
            { path: 'author', select: 'name username profilePic' },
            { path: 'solutions.author', select: 'name username profilePic' }
        ],
        options: { sort: { 'createdAt': -1 } } // Show newest saved first by their creation date, ideally we'd sort by save date but this is fine
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.savedPosts);
});

const changePassword = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { currentPassword, newPassword } = req.body;
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword; 
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
});

const deleteAccount = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await userModel.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "Account deleted successfully" });
});

module.exports = { getUserProfile, updateUserProfile, getUserByUsername, getLeaderboard, toggleSavePost, getSavedPosts, changePassword, deleteAccount };