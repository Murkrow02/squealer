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

// Squeal
router.get('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.getAllSqueals);
router.post('/squeals',
    passport.authenticate('bearer', { session: false}),
    squealController.createSqueal);

// Auth
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;