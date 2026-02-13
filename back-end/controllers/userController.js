const asyncHandler = require('express-async-handler');
const { User } = require('../models');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, avatar } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        avatar
    });

    if (user) {
        res.status(201).json(user);
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
    await user.save();  
});

// @desc    Get user by email
// @route   GET /api/users/:email
// @access  Public
const getUserByEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.params.email });

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    registerUser,
    getUserByEmail
};
