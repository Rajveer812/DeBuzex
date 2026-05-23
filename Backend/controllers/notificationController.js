const { notificationModel } = require('../schemas/notificationSchema');
const asyncHandler = require('express-async-handler');

// Get all notifications for the logged-in user
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationModel.find({ recipient: req.user._id })
        .populate('sender', 'name username profilePic')
        .populate('post', 'title') // just need the title to display "your post X"
        .sort({ createdAt: -1 })
        .limit(50); // Get the latest 50 notifications

    res.status(200).json(notifications);
});

// Mark all unread notifications as read
const markAsRead = asyncHandler(async (req, res) => {
    await notificationModel.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
});

module.exports = { getNotifications, markAsRead };
