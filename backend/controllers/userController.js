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

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('_id username type subscribedChannels smmId quota')
            .populate('subscribedChannels', '_id name category smmId')
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