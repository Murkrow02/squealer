const express = require('express');
const router = express.Router();
const path = require('path');

// shared auth page
router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/auth/auth.html'));
});

// Axios lib
router.get('/axios', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname,'../../frontend/shared/js/axios.min.js'));
});

// View models
router.get('/viewModels/base', (req, res) => {

    res.set('Content-Type', 'text/javascript');
   res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/baseViewModel.js'));
});
router.get('/viewModels/squeal', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/squealViewModel.js'));
});
router.get('/viewModels/channel', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/channelViewModel.js'));
});
router.get('/viewModels/user', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/userViewModel.js'));
});
router.get('/viewModels/smm', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/smmViewModel.js'));
});

router.get('/quack', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/app/src/assets/audio/quack.mp3'));
});

// Weather info
router.get('/weatherinfo', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/app/src/helpers/WeatherInfo.json'));
});

// Js helpers
router.get('/helpers', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname,'../../frontend/shared/js/helpers.js'));
});

module.exports = router;