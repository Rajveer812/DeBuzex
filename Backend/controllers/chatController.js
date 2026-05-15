const { chatModel } = require('../models/chatModel');
const { userModel } = require('../models/userModel');

const accessChat = async (req, res) => {
    try {
        // 1. Who does the logged-in user want to talk to?
        const { userId } = req.body; 
        if (!userId) {
            return res.status(400).json({ message: "UserId param not sent with request" });
        }

        // 2. THE SEARCH: Does a room already exist with BOTH of these users?
        // $all means the array MUST contain both req.user._id (you) AND userId (them)
        let isChat = await chatModel.find({
            participants: { $all: [req.user._id, userId] }
        })
        .populate("participants", "-password") // Grab their names and emails, but NOT passwords
        .populate("latestMessage"); // Grab the preview of the last thing said

        // If a chat room is found...
        if (isChat.length > 0) {
            // Send the existing room back to the frontend!
            return res.status(200).json(isChat[0]);
        } 
        
        // 3. THE CREATION: If no room exists, we must build a new one!
        else {
            const chatData = {
                participants: [req.user._id, userId],
            };

            // Build the room in the database
            const createdChat = await chatModel.create(chatData);

            // Fetch that brand new room and populate the names so the frontend can display them
            const FullChat = await chatModel.findOne({ _id: createdChat._id })
                .populate("participants", "-password");

            // Send the shiny new room back to the frontend!
            res.status(201).json(FullChat);
        }

    } catch (error) {
        console.log("Error accessing chat:", error);
        res.status(500).json({ message: "Server error while accessing chat." });
    }
}

const fetchChats = async (req, res) => {
    try {
        const results = await chatModel.find({
            participants: { $elemMatch: { $eq: req.user._id } }
        })
        .populate("participants", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 }); // Sort from newest to oldest

        res.status(200).json(results);
        
    } catch (error) {
        console.log("Error fetching chats:", error);
        res.status(500).json({ message: "Server error while fetching chats." });
    }
}

module.exports = { accessChat,fetchChats };