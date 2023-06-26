const {
    buildSchema
} = require('graphql');

module.exports = buildSchema(`
    type ChatRoomMessageOutputData{
        content:String!
        sender:UserDownOutputData!
    }
    type ChatRoomOutputData{
        name:String!
        creator:UserDownOutputData!
        description:String!
        userReferences:[UserStatusOutputData!]!
        messageReferences:[ChatRoomMessageOutputData!]!
    }

    type IndividualChatMessageOutputData{
        content:String!
        sender:UserDownOutputData!
        reciever:UserDownOutputData!
    }
    type IndividualChatOutputData{
        user1:UserDownOutputData!
        user2:UserDownOutputData!
        messageReferences:[IndividualChatMessageOutputData!]!
    }

    type UserOutputData{
        name:String!
        email:String!
        chatRoomReferences:[ChatRoomOutputData!]!
        individualChatReferences:[IndividualChatOutputData!]!
        onlineStatus:Boolean!
        verified:Boolean!
    }
    type UserDownOutputData{
        name:String!
        email:String!
    }
    type UserStatusOutputData{
        user:UserDownOutputData!
        status:String!
    }


    type ResultData{
        message:String!
        success:Boolean!
    }
    type RootQuery{
        chatRoomMessages(userId:ID!, chatRoomId:ID!):[ChatRoomMessageOutputData!]!
        individualChatMessages(userId:ID!, individualChatId:ID!):[IndividualChatMessageOutputData!]!
        individualChats(userId:ID!):[IndividualChatOutputData!]!

        getUser(email:String!):UserOutputData!
    }
    type RootMutation{
        createChatRoomMessage(content:String!,chatRoomReference:ID!,sender:ID!):ResultData!
        createChatRoom(name:String!,description:String!, creator:ID!):ResultData!
        addChatRoomToUser(userId:ID!,chatRoomId:ID!):ResultData!
        removeChatRoomFromUser(userId:ID!,chatRoomId:ID!):ResultData!
        
        createIndividualChatMessage(content:String!,user1:ID!,user2:ID!):ResultData!
        createIndividualChat(user1:ID!,user2:ID!):ResultData!
        addIndividualChatToUser(userId:ID!,individualChatId:ID!):ResultData!
        removeIndividualChatFromUser(userId:ID!,individualChatId:ID!):ResultData!
        
        createUser(name:String!,email:String!,password:String!):ResultData!
        updateUser(name:String!,email:String!,password:String!):ResultData!
        deleteUser(email:String!, password:String!):ResultData!
        updateUserOnlineStatus(email:String!,onlineStatus:Boolean!):ResultData!
        updateUserResetToken(resetToken:String!,resetTokenExpiration:String!):ResultData!
        
    }
    schema {
        query:RootQuery
        mutation: RootMutation
    }
`);