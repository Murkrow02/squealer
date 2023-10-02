// userController.js
const User = require('../models/userModel');

// Only for debug
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('_id username');
        res.json(users);
    } catch (error) {
        next(error);
    }
};