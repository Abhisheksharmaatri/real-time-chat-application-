const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const individualChatMessageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reciever: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    individualChatReference: {
        type: Schema.Types.ObjectId,
        ref: 'Individual-Chat',
        required: true
    }
});

module.exports = mongoose.model('Individual-Chat-Message', individualChatMessageSchema);