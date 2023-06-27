## Mutations

### Users

### Create User

```
createUser(name:"name" , email:"email", password:"password"){
    success
    message
}
```

#### Delete user

```
deleteUser(email:"email", password:"password"){
    success
    message
}
```

#### Update User

```
updateUser(name:"name2" , email:"email", password:"password"){
    success
    message
}
```

#### Update User Online Status

```
updateUserOnlineStatus(email: "email", onlineStatus:true) {
    message
    success
}
```

### chatRoom

#### Create Chat Room

```
createChatRoom(name:"Chat-Room1", creator:"649674a6fd3b7da7f1ecded3", description:"THis is the first chat room"){
    success
    message
}
```

#### Create Chat Room Message

### Individual Chat

#### Creating Individual Chat

```
createIndividualChat(user1:"6498895b22ab3d8867244522", user2:"6498895e22ab3d8867244525"){
    message
    success
}
```

#### Create Individual Chat Message

```
createIndividualChatMessage(content:"This is the first message", individualChatReference:"64988a6245ceb412ae724129", sender:"6498895b22ab3d8867244522", reciever:"6498895e22ab3d8867244525"){
    success
    message
}
```

## Queries

### User:

#### Get User

```
getUser(email: "email2") {
    name
    email
    chatRoomReferences {
        name
        creator {
            name
            email
        }
        description
        userReferences {
            status
            user {
                name
                email
            }
        }
        messageReferences {
            content
            sender {
                name
                email
            }
        }
    }
    individualChatReferences {
        user1 {
            name
            email
        }
        user2 {
            name
            email
        }
        messageReferences {
            content
            sender {
                name
                email
            }
        reciever {
            name
            email
            }
        }
    }
    onlineStatus
    verified
}
```

### Chat Room

#### Get Chat Room

```
getChatRoom(chatRoomReference:"6498898a22ab3d8867244527"){
    name
    creator{
        name
        email
    }
    description
    userReferences{
        status
        user{
            name
            email
        }
    }
    messageReferences{
        content
        sender{
            name
            email
        }
    }
}
```

### Individual Chat

#### Get Individual Chat

```
getIndividualChat(individualChatReference:"64988a6245ceb412ae724129"){
    user1{
        name
        email
    }
    user2{
        name
        email
    }
    messageReferences{
        content
        sender{
            name
            email
        }
        reciever{
            name
            email
        }
    }
}
```
