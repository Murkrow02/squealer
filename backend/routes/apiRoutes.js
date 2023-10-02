const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const squealController = require("../controllers/squealController");
const channelController = require("../controllers/channelController");
const passport = require('passport');

// Users
router.get('/users',
    passport.authenticate('bearer', { session: false }),
    userController.getAllUsers);

// Squeals
router.get('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.getFeed);
router.post('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.createSqueal);
router.get('/squeals/searchByChannelId/:channelId',
    passport.authenticate('bearer', { session: false}),
    squealController.searchByChannelId);
router.patch('/squeals/:squealId/react/:reactionId',
    passport.authenticate('bearer', { session: false}),
    squealController.reactToSqueal);
router.patch('/squeals/:squealId/unreact/:reactionId',
    passport.authenticate('bearer', { session: false}),
    squealController.unreactToSqueal);
router.patch('/squeals/:squealId/impression',
    passport.authenticate('bearer', { session: false}),
    squealController.addImpression);
router.get('/squeals/allReactions',
    passport.authenticate('bearer', { session: false}),
    squealController.getAllReactions);

// Channels
router.get('/channels',
    passport.authenticate('bearer', { session: false}),
    channelController.getAllChannels);
router.get('/channels/subscribed',
    passport.authenticate('bearer', { session: false}),
    channelController.getSubscribedChannels);
router.patch('/channels/:channelId/subscribe',
    passport.authenticate('bearer', { session: false}),
    channelController.subscribeToChannel);
router.patch('/channels/:channelId/unsubscribe',
    passport.authenticate('bearer', { session: false}),
    channelController.unsubscribeFromChannel);


// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;