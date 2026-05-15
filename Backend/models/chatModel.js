const mongoose = require('mongoose');
const { chatSchema } = require('../schemas/ChatSchema');

const chatModel = mongoose.model('Chat', chatSchema);

module.exports = {
    chatModel
}