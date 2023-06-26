const bcrypt = require('bcryptjs');

//Models
const User = require('../models/user');
const ChatRoom = require('../models/chat-room');
const ChatRoomMessage = require('../models/chat-room-message');
const IndividualChat = require('../models/individual-chat');
const IndividualChatMessage = require('../models/individual-chat-message');



//Controllers
const userController = require('../controllers/user');
const chatRoomController = require('../controllers/chat-room');
const chatRoomMessageController = require('../controllers/chat-room-message');
const individualChatController = require('../controllers/individual-chat');
const individualChatMessageController = require('../controllers/individual-chat-message');


//Resolver
module.exports = {

    //Users:
    //Mutations:
    createUser: userController.createUser, //Tested But requires to send verification email
    deleteUser: userController.deleteUser, //Tested
    updateUser: userController.updateUser, //Tested
    updateUserOnlineStatus: userController.updateUserOnlineStatus, //Tested

    //Queries:
    getUser: userController.getUser, //Tested


    //Chat Rooms:
    //Mutations:
    createChatRoom: chatRoomController.createChatRoom,
    addChatRoomToUser: chatRoomController.addChatRoomToUser,
    removeChatRoomFromUser: chatRoomController.removeChatRoomFromUser,
    createChatRoomMessage: chatRoomMessageController.createChatRoomMessage,

    //Queries:
    chatRoomMessages: chatRoomMessageController.chatRoomMessages,
    chatRooms: chatRoomController.chatRooms,

    //Individual Chats:
    //Mutations:
    createIndividualChat: individualChatController.createIndividualChat

}