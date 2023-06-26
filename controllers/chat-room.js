const {
    description
} = require('../graphql/schema');

//Models
const ChatRoom = require('../models/chat-room');
const User = require('../models/user');
const ChatRoomMessage = require('../models/chat-room-message');


//Encrytion
const EncryptionKeyLength = 10;

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


exports.createChatRoom = async function ({
    name,
    creator,
    description
}, req) {
    const encryptionKey = Math.random().toString(36).substring(2, EncryptionKeyLength);
    const chatRoom = new ChatRoom({
        name: name,
        creator: creator,
        description: description,
        encryptionKey: encryptionKey,
        userReferences: [],
        messageReferences: []
    });
    let savedChatRoom;
    try {
        savedChatRoom = await chatRoom.save();
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    let user;
    try {
        user = await User.findById(creator).populate('chatRoomReferences');
    } catch (err) {
        console.log(err);
        err.message = 'Server2 Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (!user) {
        const err = new Error('User Not Found');
        err.statusCode = 404;
        err.success = false;
        console.log(err);
        throw err;
    }
    try {
        await user.chatRoomReferences.push(savedChatRoom);
        await user.save();
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'Chat Room Created Successfully',
        statusCode: 201,
        success: true
    };
};
exports.createChatRoomMessage = async function ({
    content,
    chatRoomReference,
    sender,
}, req) {
    let chatRoom;
    try {
        chatRoom = await ChatRoom.findById(chatRoomReference).populate('messageReferences');
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (!chatRoom) {
        const err = new Error('Chat Room Not Found');
        err.statusCode = 404;
        err.success = false;
        throw err;
    }
    let user;
    try {
        user = await User.findById(sender);
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (!user) {
        const err = new Error('User Not Found');
        err.statusCode = 404;
        err.success = false;
        throw err;
    }

    let encryptionKey;
    try {
        encryptionKey = chatRoom.encryptionKey;
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    let encryptedContent;
    try {
        encryptedContent = encrypt(content, encryptionKey);
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    const chatRoomMessage = new ChatRoomMessage({
        content: encryptedContent,
        sender: sender,
        chatRoomReference: chatRoomReference
    })
    let savedChatRoomMessage;
    try {
        savedChatRoomMessage = await chatRoomMessage.save();
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    try {
        chatRoom.messageReferences.push(savedChatRoomMessage);
        await chatRoom.save();
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'Chat Room Message Created Successfully',
        statusCode: 201,
        success: true
    }
}

exports.getChatRoom = async function ({
    chatRoomReference
}, req) {
    let chatRoom;
    try {
        chatRoom = await ChatRoom.findById(chatRoomReference)
            .populate({
                path: 'creator',
                select: 'name email',
                model: 'User'
            })
            .populate({
                path: 'userReferences.user',
                select: 'name email',
                model: 'User'
            })
            .populate({
                path: 'messageReferences',
                populate: {
                    path: 'sender',
                    select: 'name email',
                    model: 'User'
                }
            });
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (!chatRoom) {
        const err = new Error('Chat Room Not Found');
        err.statusCode = 404;
        err.success = false;
        throw err;
    }
    let decryptedMessages = [];
    try {
        chatRoom.messageReferences.forEach(message => {
            const decryptedMessage = decrypt(message.content, chatRoom.encryptionKey);
            decryptedMessages.push({
                content: decryptedMessage,
                sender: message.sender
            });
        });
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        name: chatRoom.name,
        creator: chatRoom.creator,
        description: chatRoom.description,
        userReferences: chatRoom.userReferences,
        messageReferences: decryptedMessages
    }
};