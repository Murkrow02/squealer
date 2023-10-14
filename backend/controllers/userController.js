// userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Only for debug
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('_id username');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('_id username type subscribedChannels smmId quota createdChannels')
            .populate('subscribedChannels createdChannels');
        res.json(user);
    } catch (error) {
        next(error);
    }
}

exports.searchByUsername = async (req, res, next) => {
    try {
        const users = await User.find({username: {$regex: req.params.username, $options: 'i'}})
            .select('_id username');
        res.json(users);
    } catch (error) {
        next(error);
    }
}

exports.setSmm = async (req, res, next) => {

    try {

        // Get logged user
        let user = await User.findById(req.user.id).select("+smmId");

        // Get user to set as smm
        let smm = await User.findById(req.params.smmId);

        // Check if user exists
        if (!smm) {
            return res.status(404).json({error: "L'utente da impostare come smm non é stato trovato"});
        }

        // Check that target user is smm
        if (smm.type !== 'smm') {
            return res.status(400).json({error: `L'utente ${smm.username} non é un social media manager`});
        }

        // Set user as smm
        user.smmId = smm._id;

        // Save the user
        await user.save();

        // OK
        res.status(200).json({success: `L'utente ${smm.username} é stato impostato come smm`});

    } catch (error) {
        next(error);
    }
}

exports.changePassword = async (req, res, next) => {

    // Get the old and new password from the request body
    const { oldPassword, newPassword } = req.body;

    try {

        // Get the user
        let user = await User.findById(req.user.id).select("+password");

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: 'Utente non trovato' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compareSync(oldPassword, user.password);

        // If the password doesn't match
        if (!passwordMatch) {
            return res.status(403).json({ message: 'Password non corretta' });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);

        // Update the user
        user.password = bcrypt.hashSync(newPassword, salt);

        // Save the user
        await user.save();

        // OK
        res.status(200).json({message: "Password aggiornata correttamente"});
    }
    catch (error) {
        next(error);
    }
}