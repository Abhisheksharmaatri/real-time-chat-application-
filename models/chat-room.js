const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    encryptionKey: {
        type: String,
        required: true
    },
    userReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        status: {
            type: String,
            default: 'collaborator'
        }
    }],
    messageReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat-Room-Message'
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

module.exports = mongoose.model('Chat-Room', chatRoomSchema);