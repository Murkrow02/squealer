const Squeal = require('../models/squealModel');
const SquealChannel = require('../models/squealChannelModel');
const Channel = require('../models/channelModel');

// Get all squeals
exports.getAllSqueals = async (req, res, next) => {
    try {

        // Get all squeals from the database
        const squeals = await Squeal.find();

        // Send the squeals as the response
        res.status(200).json(squeals);
    } catch (error) {
        next(error);
    }
};

// Create a new squeal
exports.createSqueal = async (req, res, next) => {

    try {

        // Get channels to post in
        const channelsArray = req.body.channels;

        // Get actual squeal content
        const squealData = req.body.squeal;

        // Create a new squeal
        const squeal = new Squeal(squealData);
        squeal.userId = req.user._id;

        // Add the squeal to the channels
        channelsArray.forEach((channelId) => {

            // Search for requested channel
            Channel.findOne({id: channelId}, (err, channel) => {

                // If the channel exists
                if (channel) {

                        // Add the squeal to the channel
                        const squealChannel = new SquealChannel({
                            squealId: squeal._id,
                            channelId: channel._id,
                        });
                        squealChannel.save();
                }

                // If the channel doesn't exist
                else {
                    // Send an error
                    res.status(404).json({
                        message: "Channel not found",
                    });
                }
            });
        });

        // Save the squeal
        await squeal.save();

        // Send the squeal as response
        res.status(201).json(squeal);
    }
    catch (error) {
        next(error);
    }
}

