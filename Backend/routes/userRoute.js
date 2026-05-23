const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserByUsername, getLeaderboard, toggleSavePost, getSavedPosts, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// When a GET request hits /profile, run the 'protect' middleware FIRST. 
// If protect says 'next()', then run getUserProfile.
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePic'), updateUserProfile);
router.get('/leaderboard', protect, getLeaderboard);

// Saved Posts Routes
router.put('/save-post/:postId', protect, toggleSavePost);
router.get('/saved-posts', protect, getSavedPosts);

// Settings Routes
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

// This generic route should be last so it doesn't accidentally catch specific routes like /profile
router.get('/:username', protect, getUserByUsername);

module.exports = router;