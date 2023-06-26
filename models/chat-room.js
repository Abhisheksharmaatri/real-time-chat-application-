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
    }, //Secret
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, //Populate
    description: {
        type: String,
        required: true
    },
    userReferences: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            default: 'collaborator'
        }
    }], //Populate
    messageReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat-Room-Message'
    }] //Populate
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