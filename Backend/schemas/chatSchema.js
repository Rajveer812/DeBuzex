const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    // --- NEW FIELDS FOR OPTION 2 (MESSAGE REQUESTS) ---
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Remembers who sent the first message
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending' // All new chats start as requests!
    }
}, { timestamps: true });

// CRITICAL FIX: Build the model using the schema before exporting!
const chatModel = mongoose.model('Chat', chatSchema);

module.exports = { chatModel };