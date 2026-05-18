const { chatModel } = require('../models/chatModel');
const { userModel } = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const accessChat = asyncHandler(async (req, res) => {
        // Who does the logged-in user want to talk to?
        const { userId } = req.body; 
        if (!userId) {
            return res.status(400).json({ message: "UserId param not sent with request" });
        }

        // THE SEARCH: Does a room already exist with BOTH of these users?
        // $all means the array MUST contain both req.user._id (you) AND userId (them)
        let isChat = await chatModel.find({
            participants: { $all: [req.user._id, userId] }
        })
        .populate("participants", "-password") // Grab their names and emails, but NOT passwords
        .populate("latestMessage"); // Grab the preview of the last thing said

        // If a chat room is found...
        if (isChat.length > 0) {
            return res.status(200).json(isChat[0]);
        } 
        
        // If no room exists, build a new one!
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
});

const fetchChats = asyncHandler(async(req,res)=>{
        const results = await chatModel.find({
            participants: { $elemMatch: { $eq: req.user._id } }
        })
        .populate("participants", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 }); // Sort from newest to oldest

        res.status(200).json(results);
});

module.exports = { accessChat,fetchChats };