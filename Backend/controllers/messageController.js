const { messageModel } = require('../models/messageModel');
const { chatModel } = require('../models/chatModel');
const asyncHandler = require('express-async-handler');

const sendMessage = asyncHandler(async (req, res) => {
        const { text, chatId } = req.body;
        if (!text || !chatId) {
            return res.status(400).json({ message: "Invalid data passed into request" });
        }
        const newMessageData = {
            senderId: req.user._id, // The Bouncer gives us this!
            text: text,
            chatId: chatId,
            readBy: [req.user._id]
        };

        let message = await messageModel.create(newMessageData);
        message = await message.populate("senderId", "name username profilePic");
        message = await message.populate("chatId");

        await chatModel.findByIdAndUpdate(chatId, { latestMessage: message });
        res.status(201).json(message);
});

const allMessages = asyncHandler(async(req,res) =>{
        // Mark all messages in this chat as read by the user
        await messageModel.updateMany(
            { chatId: req.params.chatId, readBy: { $ne: req.user._id } },
            { $push: { readBy: req.user._id } }
        );

        const messages = await messageModel.find({ chatId: req.params.chatId })
            .populate("senderId", "name username profilePic");

        res.status(200).json(messages);
     
});

const getUnreadCount = asyncHandler(async(req, res) => {
    // 1. Find all active chats for this user
    const userChats = await chatModel.find({ participants: req.user._id }).select('_id');
    const chatIds = userChats.map(c => c._id);

    // 2. Find distinct chatIds that have at least one unread message
    const unreadChats = await messageModel.distinct('chatId', {
        chatId: { $in: chatIds },
        readBy: { $ne: req.user._id }
    });

    res.status(200).json({ unreadCount: unreadChats.length });
});

module.exports = { sendMessage, allMessages, getUnreadCount };