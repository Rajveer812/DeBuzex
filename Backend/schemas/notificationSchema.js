const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: { 
        type: String, 
        enum: ['like', 'solution', 'star', 'accept', 'chat_request'], 
        required: true 
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' }, // For post-related notifications
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

const notificationModel = mongoose.model('Notification', notificationSchema);

module.exports = { notificationModel };
