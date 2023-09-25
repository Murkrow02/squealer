const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const passport = require('passport');

// Users
router.get('/users',
    passport.authenticate('bearer', { session: false }),
    userController.getAllUsers);

// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;