const express = require('express');
const router = express.Router();
const { registerUser, getUserByEmail } = require('../controllers/userController');

router.route('/')
    .post(registerUser);

router.route('/:email')
    .get(getUserByEmail);

module.exports = router;
