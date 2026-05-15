const express = require('express');
const router = express.Router();
const { accessChat,fetchChats } = require('../controllers/chatController');
const {protect}=require('../middleware/authMiddleware');

router.post('/', protect, accessChat);
router.get('/', protect,fetchChats);
module.exports = router;