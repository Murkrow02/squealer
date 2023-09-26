// userController.js
const Channel = require('../models/channelModel');
const User = require('../models/userModel');

// Example controller methods
exports.subscribeToChannel = async (req, res, next) => {

    // Get logged user from the request
    const user = req.User;
    console.log(user);

    return res.status(200).json({ message: 'Ti sei iscritto con successo' });

    // // Find requested channel
    // const channel = await Channel.findOne({ _id: req.params.channelId });
    // console.log(channel);
    //
    // // Check if the channel exists
    // if (!channel) {
    //     return res.status(404).json({ message: 'Canale non trovato' });
    // }
    //
    // // Check if the user is already subscribed
    // if (req.User.channels.includes(channel._id)) {
    //     return res.status(400).json({ message: 'Sei già iscritto al canale' });
    // }



}