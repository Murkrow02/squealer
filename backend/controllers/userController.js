// userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Only for moderator
exports.getAllUsers = async (req, res, next) => {
    try {

        // Check that user is smm
        if (req.user.type !== 'moderator') {
            return res.status(400).json({error: `Non sei un social media manager`});
        }

        const users = await User.find().select('_id username type popularSquealCount unpopularSquealCount')
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// Get profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('_id username type subscribedChannels smmId quota createdChannels')
            .populate('subscribedChannels createdChannels smmId');
        res.json(user);
    } catch (error) {
        next(error);
    }
}

// Search users by username
exports.searchByUsername = async (req, res, next) => {
    try {

        let userType = req.query.type;

        // Search all users except guests
        let users = User.find({username: {$regex: req.params.username, $options: 'i'}, type: {$ne: 'guest'}}).select('_id username');

        // Filter users by type
        if (userType) {
            users = users.find({type: userType});
        }

        res.json(await users);
    } catch (error) {
        next(error);
    }
}

// Choose smm for user
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

        // Check that user is pro user
        if (user.type !== 'prouser') {
            return res.status(400).json({error: `Devi essere pro user per impostare un social media manager`});
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

// Remove smm for user
exports.removeSmm = async (req, res, next) => {

    // Get logged user
    let user = await User.findById(req.user.id).select("+smmId");

    try {

        // Check if user has a smm
        if (!user.smmId) {
            return res.status(400).json({error: `Non hai nessun social media manager`});
        }

        // Remove smm
        user.smmId = undefined;

// Save the user
        await user.save();

        // OK
        res.status(200).json({success: `Il tuo social media manager é stato rimosso`});

    } catch (error) {
        next(error);
    }
}

exports.changePassword = async (req, res, next) => {

    // Get the old and new password from the request body
    const {oldPassword, newPassword} = req.body;

    try {

        // Get the user
        let user = await User.findById(req.user.id).select("+password");

        // Check if the user exists
        if (!user) {
            return res.status(401).json({message: 'Utente non trovato'});
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compareSync(oldPassword, user.password);

        // If the password doesn't match
        if (!passwordMatch) {
            return res.status(403).json({message: 'Password non corretta'});
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);

        // Update the user
        user.password = bcrypt.hashSync(newPassword, salt);

        // Save the user
        await user.save();

        // OK
        res.status(200).json({message: "Password aggiornata correttamente"});
    } catch (error) {
        next(error);
    }
}

exports.deleteProfile = async (req, res, next) => {
    try {

        // Get the user
        let user = await User.findById(req.user.id);

        // Check if the user exists
        if (!user) {
            return res.status(401).json({message: 'Utente non trovato'});
        }

        // Delete the user
        await user.deleteOne();

        // OK
        res.status(200).json({message: "Profilo eliminato correttamente"});
    } catch (error) {
        next(error);
    }
}

exports.goPro = async (req, res, next) => {
    try {
        //get user
        let user = await User.findById(req.user.id);
        //check if user is already pro
        if (user.type === 'prouser') {
            return res.status(400).json({error: 'You are already a pro user'});
        }
        //make user pro
        user.type = 'prouser';
        //save user
        await user.save();
        //return success
        res.status(200).json({success: 'Now you are a pro user'});
    }
    catch (error) {
        next(error);
    }
}