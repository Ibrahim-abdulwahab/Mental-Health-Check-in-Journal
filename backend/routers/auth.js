const express = require('express');
const router = express.Router();
const { signUp, login } = require('../controllers/authController');

// Signup route
router.post('/signup', signUp);

// Login route
//router.post('/login', login);

module.exports = router;
