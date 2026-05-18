const { userModel } = require('../models/userModel');
const asyncHandler = require('express-async-handler');

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
      user.profilePic = req.body.profilePic || user.profilePic;
      
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
        message: "Profile updated successfully!"
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
});

module.exports = { getUserProfile,updateUserProfile };