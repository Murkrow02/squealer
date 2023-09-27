const Squeal = require('../models/squealModel');
const SquealChannel = require('../models/squealChannelModel');
const Channel = require('../models/channelModel');

// Get all squeals
exports.getAllSqueals = async (req, res, next) => {
    try {

        // Get all squeals from the database
        const squeals = await Squeal.find().populate('createdBy');

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

        // Check if provided channels are all valid
        const validChannels = await Channel.find({ _id: { $in: channelsArray } });
        if (validChannels.length !== channelsArray.length) {
            return res.status(400).json({ error: 'Almeno uno dei canali forniti non é stato trovato' });
        }

        // Create a new squeal
        const squeal = new Squeal(squealData);
        squeal.createdBy = req.user._id;
        await squeal.save();

        // Create a new squealChannel for each channel
        for (let i = 0; i < channelsArray.length; i++) {
            const squealChannel = new SquealChannel({
                squealId: squeal._id,
                channelId: channelsArray[i]
            });
            await squealChannel.save();
        }

        // Send the squeal as response
        res.status(201).json(squeal);
    }
    catch (error) {
        next(error);
    }
}

