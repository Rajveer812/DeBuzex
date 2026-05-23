const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserByUsername, getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// When a GET request hits /profile, run the 'protect' middleware FIRST. 
// If protect says 'next()', then run getUserProfile.
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/:username', protect, getUserByUsername);

module.exports = router;