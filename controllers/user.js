const bcrypt = require('bcryptjs');


//Models
const User = require('../models/user');


exports.createUser = async function ({
    name,
    email,
    password
}, req) {
    let existingUser;
    try {
        existingUser = await User.findOne({
            email: email
        });
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    if (existingUser) {
        const error = new Error('User already exists');
        err.statusCode = 422;
        err.success = false;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        chatRoomReferences: [],
        chatReferences: [],
        onlineStatus: false,
        resetToken: null,
        resetTokenExpiration: null
    });
    try {
        await user.save();
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'User created successfully',
        statusCode: 201,
        success: true
    };
}

exports.deleteUser = async function ({
    email,
    password
}, req) {
    let user;
    try {
        user = await User.findOne({
            email: email
        });
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }

    if (!user) {
        const error = new Error('User not found');
        err.statusCode = 404;
        err.success = false;
        throw error;
    }

    let isEqual;

    try {
        isEqual = await bcrypt.compare(password, user.password);
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }

    if (!isEqual) {
        const error = new Error('Password is incorrect');
        err.statusCode = 401;
        err.success = false;
        throw error;
    }
    try {
        await User.deleteOne({
            _id: user._id
        });
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'User deleted successfully',
        statusCode: 200,
        success: true
    };
}

exports.updateUser = async function ({
    name,
    email,
    password
}, req) {
    let user;
    try {
        user = await User.findOne({
            email: email
        });
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }

    if (!user) {
        const error = new Error('User not found');
        err.statusCode = 404;
        err.success = false;
        throw error;
    }

    let isEqual;

    try {
        isEqual = await bcrypt.compare(password, user.password);
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }

    if (!isEqual) {
        const error = new Error('Password is incorrect');
        err.statusCode = 401;
        err.success = false;
        throw error;
    }
    try {
        user.name = name;
        await user.save();
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'User updated successfully',
        success: true,
        statusCode: 200
    }
};

exports.getUser = async function ({
    email
}, req) {
    let user;
    try {
        user = await User.findOne({
                email: email
            })
            .populate({
                path: 'chatRoomReferences',
                populate: [{
                        path: 'creator',
                        select: 'name email'
                    },
                    {
                        path: 'userReferences.user',
                        select: 'name email'
                    },
                    {
                        path: 'messageReferences',
                        populate: {
                            path: 'sender reciever individualChatReference',
                            select: 'name email user1 user2'
                        }
                    }
                ]
            })
            .populate({
                path: 'individualChatReferences',
                populate: [{
                        path: 'user1 user2',
                        select: 'name email'
                    },
                    {
                        path: 'messageReferences',
                        populate: {
                            path: 'sender reciever individualChatReference',
                            select: 'name email user1 user2'
                        }
                    }
                ]
            })
            .select('-password').select('-resetToken').select('-resetTokenExpiration').select('-_v').select('-_id').select('-id') // Excludes the password field from the result
        console.log('User: ', user);
    } catch (err) {
        console.log(err);
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.success = false;
        throw error;
    }

    return {
        name: user.name,
        email: user.email,
        individualChatReferences: user.individualChatReferences,
        chatRoomReferences: user.chatRoomReferences,
        onlineStatus: user.onlineStatus,
        verified: user.verified,
        success: true,
        statusCode: 200,
        message: 'User fetched successfully'
    }
}

exports.updateUserOnlineStatus = async function ({
    email,
    onlineStatus
}, req) {
    let user;
    try {
        user = await User.findOne({
            email: email
        });
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.success = false;
        throw error;
    }
    try {
        user.onlineStatus = onlineStatus;
        await user.save();
    } catch (err) {
        err.message = 'Server Error';
        err.statusCode = 500;
        err.success = false;
        throw err;
    }
    return {
        message: 'User online status updated successfully',
        success: true,
        statusCode: 200
    }
}