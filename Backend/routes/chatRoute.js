const express = require('express');
const router = express.Router();
const { accessChat,fetchChats,updateChatStatus } = require('../controllers/chatController');
const {protect}=require('../middleware/authMiddleware');

router.post('/', protect, accessChat);
router.get('/', protect,fetchChats);
router.put('/status', protect, updateChatStatus);
module.exports = router;