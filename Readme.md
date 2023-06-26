# Real-time Chat Application with WebSockets

## Description:

Build a real-time chat application using Node.js, Express.js, and WebSockets. The application should allow users to create accounts, log in, and join chat rooms where they can exchange messages with other users in real time. Implement features like online/offline status, typing indicators, and message notifications. You can use the Socket.IO library for WebSocket communication.

## Features:

### User registration and authentication:

Allow users to sign up, log in, and manage their profiles.

### Chat room creation and joining:

Users should be able to create new chat rooms or join existing ones.

### Real-time messaging:

Enable users to send and receive messages instantly within the chat rooms.

### Online/offline status: S

how users' online/offline status in the chat interface.

### Typing indicators:

Display typing indicators when a user is actively typing a message.

### Message notifications:

Notify users of new messages, even if they are not currently active in the chat room.

### File attachments:

Allow users to upload and share files within the chat rooms.

### User search:

Implement a search functionality to find other users and start private conversations.

## Models Overview

### User Model

1. The User model represents application users and includes attributes like name, email, and password.
2. It establishes relationships with Chat-Room and Individual-Chat models.
3. Features include online status and password reset.

### Individual Chat Model

1. The Individual-Chat model handles one-on-one conversations, with attributes such as encryptionKey and references to the User model.
2. It maintains a collection of messages associated with each individual chat.

### Individual Chat Message Model

1. The Individual-Chat-Message model stores messages for individual chats.
2. It includes attributes like content, sender, receiver, and a reference to the Individual-Chat model.

### Chat Room Model

1. The Chat-Room model manages group chat rooms, featuring attributes like name, encryptionKey, and references to the User model.
2. It also maintains a collection of messages associated with each chat room.

### Chat Room Message Model

1. The Chat-Room-Message model stores messages for chat rooms, including attributes like content, a reference to the Chat-Room model, and the sender's reference.

These models enable efficient user management, secure individual chats, and collaborative group chat rooms within the application.
