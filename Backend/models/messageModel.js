const mongoose = require('mongoose');
const { messageSchema } = require('../schemas/messageSchema');

const messageModel = mongoose.model('Message', messageSchema);

module.exports = {
    messageModel
}