const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatRoomMessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    chatRoomReference: {
        type: Schema.Types.ObjectId,
        ref: 'Chat-Room',
        required: true
    }, //Populate
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } //Populate
});

module.exports = mongoose.model('Chat-Room-Message', chatRoomMessageSchema);