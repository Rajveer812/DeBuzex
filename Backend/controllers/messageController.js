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
        };

        let message = await messageModel.create(newMessageData);
        message = await message.populate("senderId", "name username profilePic");
        message = await message.populate("chatId");

        await chatModel.findByIdAndUpdate(chatId, { latestMessage: message });
        res.status(201).json(message);
});

const allMessages = asyncHandler(async(req,res) =>{
        const messages = await messageModel.find({ chatId: req.params.chatId })
            .populate("senderId", "name username profilePic");

        res.status(200).json(messages);
     
});

module.exports = { sendMessage, allMessages };