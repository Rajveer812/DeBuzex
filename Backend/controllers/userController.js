const { userModel } = require('../models/userModel');

const getUserProfile = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching profile' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (user) {
      // If the frontend sent a new name/bio, update it. If not, keep the old one.
      user.name = req.body.name || user.name;
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
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating profile' });
  }
};

module.exports = { getUserProfile,updateUserProfile };