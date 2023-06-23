const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const individualChatSchema = new Schema({
    encryptionKey: {
        type: String,
        required: true
    },
    user1: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'Individual-Chat-Message'
    }]
}, {
    timestamps: true,
    usePushEach: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
});

module.exports = mongoose.model('Individual-Chat', individualChatSchema);