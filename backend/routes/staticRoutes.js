const express = require('express');
const router = express.Router();
const path = require('path');

// shared auth page
router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/auth/auth.html'));
});

// Axios lib
router.get('/axios', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/js/axios.min.js'));
});

// View models
router.get('/viewModels/base', (req, res) => {
   res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/baseViewModel.js'));
});
router.get('/viewModels/squeal', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/squealViewModel.js'));
});
router.get('/viewModels/channel', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/channelViewModel.js'));
});
router.get('/viewModels/user', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/viewmodels/userViewModel.js'));
});


module.exports = router;