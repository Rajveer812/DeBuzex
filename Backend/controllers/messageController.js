const { messageModel } = require('../models/messageModel');
const { chatModel } = require('../models/chatModel');

const sendMessage = async (req, res) => {
    try {
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
    } catch (error) {
        console.log("Error sending message:", error);
        res.status(500).json({ message: "Server error sending message." });
    }
};

const allMessages = async (req, res) => {
    try {
        const messages = await messageModel.find({ chatId: req.params.chatId })
            .populate("senderId", "name username profilePic");

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error fetching messages:", error);
        res.status(500).json({ message: "Server error fetching messages." });
    }
};

module.exports = { sendMessage, allMessages };