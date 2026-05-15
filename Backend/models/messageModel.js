const mongoose = require('mongoose');
const { messageSchema } = require('../schemas/MessageSchema');

const messageModel = mongoose.model('Message', messageSchema);

module.exports = {
    messageModel
}