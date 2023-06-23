const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chatRoomReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat-Room'
    }],
    chatReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'Individual-Chat'
    }],
    onlineStatus: {
        type: Boolean,
        default: false
    },
    resetToken: String,
    resetTokenExpiration: Date
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

userSchema.index({
    email: 1
}, {
    unique: true
});

module.exports = mongoose.model('User', userSchema);