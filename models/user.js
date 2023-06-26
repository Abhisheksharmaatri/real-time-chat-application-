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
    }, //Secret
    chatRoomReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat-Room'
    }], //Populate
    chatReferences: [{
        type: Schema.Types.ObjectId,
        ref: 'Individual-Chat'
    }], //Populate
    onlineStatus: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    resetToken: String, //Secret
    resetTokenExpiration: Date //Secret
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