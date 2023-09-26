const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const squealController = require("../controllers/squealController");

const passport = require('passport');

// Users
router.get('/users',
    passport.authenticate('bearer', { session: false }),
    userController.getAllUsers);

// Squeals
router.get('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.getAllSqueals);
router.post('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.createSqueal);

// Channels
router.get('/channels',
    passport.authenticate('bearer', { session: false}),
    userController.getAllChannels);
router.patch('/channels/:channelId/subscribe',
    passport.authenticate('bearer', { session: false}),


// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;