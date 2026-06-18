const mongoose = require('mongoose');
const { chatSchema } = require('../schemas/chatSchema');

const chatModel = mongoose.model('Chat', chatSchema);

module.exports = {
    chatModel
}