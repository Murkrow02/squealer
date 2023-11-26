const Squeal = require("../models/squealModel");
const User = require('../models/userModel');


exports.smmFeed = async (req, res, next) => {

    // Get administrated user
    const administratedUser = await User.findOne({smmId: req.user._id}).select("+quota +markedAsPopular +markedAsUnpopular").populate('quota smmId');

    // Return if not smm or if administrated user is not provided
    if (req.user.type !== "smm" || administratedUser === null)
    {
        return res.status(403).json({error: 'Non sei un smm'});
    }

    try {

        // Get query for search
        const searchQuery = req.query.search;

        // Get squeals from administrated user ordered by date
        const squeals = await Squeal.where({createdBy: administratedUser._id.toHexString()})
            .sort({createdAt: -1})
            .populate('postedInChannels').populate('reactions');

        // Replace squeals private channel with the name of user who posted it
        for (let i = 0; i < squeals.length; i++) {
            for (let j = 0; j < squeals[i].postedInChannels.length; j++) {
                if (squeals[i].postedInChannels[j].category === "private") {
                    let channelUser = await User.findOne({privateChannelId: squeals[i].postedInChannels[j]._id.toHexString()});
                    squeals[i].postedInChannels[j].name = '@'+channelUser.username;
                }
            }
        }



        // Send the squeals as the response
        res.status(200).json({administratedUser,squeals});
    }
    catch (error) {
        next(error);
    }
};

exports.getReplies = async (req, res, next) => {

    // Get administrated user
    const administratedUser = await User.findOne({smmId: req.user._id});

    // Return if not smm or if administrated user is not provided
    if (req.user.type !== "smm" || administratedUser === null)
    {
        return res.status(403).json({error: 'Non sei un smm'});
    }

    try {

        // Get squeal id
        const squealId = req.params.squealId;

        // Get all replies to the squeal
        const replies = await Squeal.where({replyTo: squealId}).populate('postedInChannels').populate('reactions').populate('createdBy');

        // Send the replies as the response
        res.status(200).json({replies});
    }
    catch (error) {
        next(error);
    }
}