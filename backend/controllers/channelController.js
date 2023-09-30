// userController.js
const Channel = require('../models/channelModel');
const User = require('../models/userModel');

exports.subscribeToChannel = async (req, res, next) => {

    // Get logged user
    let user = await User.findById(req.user.id).select("+subscribedChannels");

    // Get channel to subscribe to
    let channel = await Channel.findById(req.params.channelId);

    // Check if channel exists
    if (!channel) {
        return res.status(404).json({error: "Il canale non é stato trovato"});
    }

    // Check if user subscribed channels array is not initialized
    if (!user.subscribedChannels) {
        user.subscribedChannels = [];
    }

    // Check if user is already subscribed to the channel
    if (!user.subscribedChannels.includes(channel._id)) {

        // Actually subscribe the user to the channel
        user.subscribedChannels.push(channel._id);
    }

    // Save the user
    await user.save();

    // OK
    res.status(200).json({success: `Iscrizione a ${channel.name} avvenuta con successo`});
}

exports.unsubscribeFromChannel = async (req, res, next) => {

    // Get logged user
    let user = await User.findById(req.user.id).select("+subscribedChannels");

    // Get channel to unsubscribe from
    let channel = await Channel.findById(req.params.channelId);

    // Check if channel exists
    if (!channel) {
        return res.status(404).json({error: "Il canale non é stato trovato"});
    }

    // Check if user subscribed channels array is not initialized
    if (!user.subscribedChannels) {
        user.subscribedChannels = [];
    }

    // Check if user is actually subscribed to the channel
    if (user.subscribedChannels.includes(channel._id)) {

        // Actually unsubscribe the user from the channel
        user.subscribedChannels.splice(user.subscribedChannels.indexOf(channel._id), 1);
        await user.save();

        // OK
        return res.status(200).json({success: `Disiscrizione da ${channel.name} avvenuta con successo`});
    } else {
        return res.status(404).json({error: "Non sei iscritto a questo canale"});
    }
}

exports.getSubscribedChannels = async (req, res, next) => {

}

exports.getAllChannels = async (req, res, next) => {

    // Get all channels from the database
    const channels = await Channel.find();

    // Send the channels as the response
    res.status(200).json(channels);
}
