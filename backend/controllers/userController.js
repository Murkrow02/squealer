// userController.js
const User = require('../models/userModel');

// Example controller methods
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('_id username');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};