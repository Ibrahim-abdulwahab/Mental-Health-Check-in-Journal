const express = require('express');
const router = express.Router();
const { signUp, login , logout} = require('../controllers/authController');

// Signup route
router.post('/signup', signUp);

// Login route
router.post('/login', login);

//logout route
router.post('/logout', logout);

module.exports = router;
