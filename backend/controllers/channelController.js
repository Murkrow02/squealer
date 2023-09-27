// userController.js
const Channel = require('../models/channelModel');
const User = require('../models/userModel');

exports.subscribeToChannel = async (req, res, next) => {

}

exports.unsubscribeFromChannel = async (req, res, next) => {

}

exports.getSubscribedChannels = async (req, res, next) => {

}

exports.getAllChannels = async (req, res, next) => {

    // Get all channels from the database
    const channels = await Channel.find();

    // Send the channels as the response
    res.status(200).json(channels);
}
