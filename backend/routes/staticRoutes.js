const express = require('express');
const router = express.Router();
const path = require('path');

// Shared auth page
router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname,'../../frontend/shared/auth/auth.html'));
});


module.exports = router;