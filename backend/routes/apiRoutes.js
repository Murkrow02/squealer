const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const squealController = require("../controllers/squealController");
const channelController = require("../controllers/channelController");
const passport = require('passport');
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  path.join(__dirname, '../storage'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Users
router.get('/users',
    passport.authenticate('bearer', { session: false }),
    userController.getAllUsers);
router.get('/users/profile',
    passport.authenticate('bearer', { session: false }),
    userController.getProfile);
router.get('/users/searchByUsername/:username',
    passport.authenticate('bearer', { session: false }),
    userController.searchByUsername);
router.patch('/users/setSmm/:smmId',
    passport.authenticate('bearer', { session: false }),
    userController.setSmm);
router.patch('/users/profile/changePassword',
    passport.authenticate('bearer', { session: false }),
    userController.changePassword);

// Squeals
router.get('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.getFeed);
router.post('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.createSqueal);
router.post('/squeals/:squealId/media',
    upload.single('media'),
    passport.authenticate('bearer', { session: false}),
    squealController.addMediaToSqueal);
router.get('/squeals/searchByChannelId/:channelId',
    passport.authenticate('bearer', { session: false}),
    squealController.searchByChannelId);
router.get('/squeals/allReactions',
    passport.authenticate('bearer', { session: false}),
    squealController.getAllReactions);
router.patch('/squeals/:squealId/react/:reactionId',
    passport.authenticate('bearer', { session: false}),
    squealController.reactToSqueal);
router.patch('/squeals/:squealId/unreact/:reactionId',
    passport.authenticate('bearer', { session: false}),
    squealController.unreactToSqueal);
router.patch('/squeals/:squealId/impression',
    passport.authenticate('bearer', { session: false}),
    squealController.addImpression);

// Channels
router.get('/channels',
    passport.authenticate('bearer', { session: false}),
    channelController.getAllChannels); //DEBUG ONLY
router.patch('/channels/:channelId/subscribe',
    passport.authenticate('bearer', { session: false}),
    channelController.subscribeToChannel);
router.patch('/channels/:channelId/unsubscribe',
    passport.authenticate('bearer', { session: false}),
    channelController.unsubscribeFromChannel);
router.get('/channels/:channelCategory',
    passport.authenticate('bearer', { session: false}),
    channelController.getChannelsByCategory);
router.post('/channels',
    passport.authenticate('bearer', { session: false}),
    channelController.createChannel);
router.patch('/channels/:channelId/ban/:userId',
    passport.authenticate('bearer', { session: false}),
    channelController.bandUserFromChannel);

// Auth
router.post('/auth/login', authController.login);
router.post('/auth/register/:guest', authController.register);

module.exports = router;