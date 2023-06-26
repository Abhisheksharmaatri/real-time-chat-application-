const {
    description
} = require('../graphql/schema');

//Models
const ChatRoom = require('../models/chat-room');
const User = require('../models/user');
const IndividualChat = require('../models/individual-chat');
const IndividualChatMessage = require('../models/individual-chat-message');
const EncryptionKeyLength = 10;

//Encrytion
const CryptoJS = require('crypto-js');

// Encryption function
function encrypt(text, encryptionKey) {
    const encrypted = CryptoJS.AES.encrypt(text, encryptionKey).toString();
    return encrypted;
}

// Decryption function
function decrypt(encryptedText, encryptionKey) {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
}

exports.createIndividualChat = async function ({
    user1,
    user2
}, req) {
    let User1, User2;
    try {
        User1 = await User.findById(user1).populate('individualChatReferences');
        User2 = await User.findById(user2).populate('individualChatReferences');
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (!User1 || !User2) {
        const err = new Error('User Not Found');
        err.statusCode = 404;
        err.success = false;
        console.log(err);
        throw err;
    }
    let encryptionKey;
    try {
        encryptionKey = Math.random().toString(36).substring(2, EncryptionKeyLength);
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    const individualChat = new IndividualChat({
        encryptionKey: encryptionKey,
        user1: User1,
        user2: User2,
        messageReferences: []
    });
    let savedIndividualChat;
    try {
        savedIndividualChat = await individualChat.save();
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    try {
        await User1.individualChatReferences.push(savedIndividualChat);
        await User2.individualChatReferences.push(savedIndividualChat);
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    try {
        await User1.save();
        await User2.save();
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'Individual Chat Created Successfully',
        statusCode: 201,
        success: true
    }
};

exports.createIndividualChatMessage = async function ({
    content,
    sender,
    reciever,
    individualChatReference
}, req) {
    let individualChat;
    try {
        individualChat = await IndividualChat.findById(individualChatReference).populate('messageReferences');
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (!individualChat) {
        const err = new Error('Individual Chat Not Found');
        err.statusCode = 404;
        err.success = false;
        console.log(err);
        throw err;
    }
    let encryptionKey;
    try {
        encryptionKey = individualChat.encryptionKey;
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    let encryptedContent;
    try {
        encryptedContent = encrypt(content, encryptionKey);
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    const individualChatMessage = new IndividualChatMessage({
        content: encryptedContent,
        sender: sender,
        reciever: reciever,
        individualChatReference: individualChat
    });
    let savedIndividualChatMessage;
    try {
        savedIndividualChatMessage = await individualChatMessage.save();
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    try {
        await individualChat.messageReferences.push(savedIndividualChatMessage);
        await individualChat.save();
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'Individual Chat Message Created Successfully',
        statusCode: 201,
        success: true
    }
};

exports.getIndividualChat = async function ({
    individualChatReference
}, req) {
    let individualChat;
    try {
        individualChat = await IndividualChat.findById(individualChatReference)
            .populate({
                path: 'user1',
                select: 'name email',
                model: 'User'
            })
            .populate({
                path: 'user2',
                select: 'name email',
                model: 'User'
            })
            .populate({
                path: 'messageReferences',
                select: 'content sender reciever',
                populate: {
                    path: 'sender reciever',
                    select: 'name email',
                    model: 'User'
                },
                model: 'Individual-Chat-Message'
            })
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (!individualChat) {
        const err = new Error('Individual Chat Not Found');
        err.statusCode = 404;
        err.success = false;
        console.log(err);
        throw err;
    }
    let encryptionKey;
    try {
        encryptionKey = individualChat.encryptionKey;
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    let decryptedMessages = [];
    try {
        individualChat.messageReferences.forEach(message => {
            const decryptedContent = decrypt(message.content, encryptionKey);
            decryptedMessages.push({
                content: decryptedContent,
                sender: message.sender,
                reciever: message.reciever
            });
        });
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        user1: individualChat.user1,
        user2: individualChat.user2,
        messageReferences: decryptedMessages
    }
}