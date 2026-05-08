const express = require('express');
const router = express.Router();
const { getUserProfile,updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// When a GET request hits /profile, run the 'protect' middleware FIRST. 
// If protect says 'next()', then run getUserProfile.
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;