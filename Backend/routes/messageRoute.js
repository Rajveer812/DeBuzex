const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessages, getUnreadCount } = require('../controllers/messageController');

router.get('/unread-count', protect, getUnreadCount);
router.get('/:chatId', protect, allMessages);
router.post('/', protect, sendMessage);

module.exports = router;