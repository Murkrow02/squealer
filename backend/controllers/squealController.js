const Squeal = require('../models/squealModel');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Reaction = require('../models/reactionModel');
const multer = require('multer');
const path = require("path");
const {json} = require("express");

// Feed for user
exports.getFeed = async (req, res, next) => {
    try {

        // Create feed for user
        const squeals = await createFeedForUser(req.user.id);

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
        const validChannels = await Channel.find({_id: {$in: channelsArray}});
        if (validChannels.length !== channelsArray.length) {
            return res.status(400).json({error: 'Almeno uno dei canali forniti non é stato trovato'});
        }

        // Check if at least one channel is not private (in this case we should check quota)
        let shouldCheckQuota = false;
        validChannels.forEach(channel => {

            // Found channel that is not private, so we should check quota
            if (channel.category !== 0) {
                shouldCheckQuota = true;
            }

            //TODO: also check if user can post in channel
        });

        // Check if user has exceeded quota
        if (shouldCheckQuota) {
            let quotaExceeded = await checkIfExceedsQuota(req.user.id, squealData)
            if (quotaExceeded)
                return res.status(400).json({error: `Hai superato la quota ${quotaExceeded}`});
        }

        // No quota was exceeded, create a new squeal
        let squeal = await createSqueal(squealData,req.user._id, channelsArray);

        // Send the squeal as response
        res.status(201).json(squeal);
    } catch (error) {
        next(error);
    }
}

exports.addMediaToSqueal = async (req, res, next) => {

    // Get squeal id
    const squealId = req.params.squealId;

    // Get squeal from database
    let squeal = await Squeal.findById(squealId);

    // Check if squeal exists
    if (!squeal) {
        return res.status(404).json({error: 'Squeal non trovato'});
    }

    // Check if squeal is media type
    if (squeal.contentType !== "media") {
        return res.status(400).json({error: 'Squeal non di tipo media'});
    }

    // Update squeal mediaUrl
    squeal.mediaUrl = "/storage/" + path.basename(req.file.path);

    // Save squeal
    await squeal.save();

    // Return squeal as response
    res.status(200).json(squeal);
}

// Search squeals by channel id
exports.searchByChannelId = async (req, res, next) => {

    // We receive the channel id as a query parameter
    const channelId = req.params.channelId;

    try {

        // Check if requested channel is private one, in that case we only search in mentioned channels and not in posted in channels (privacy)
        const searchInMentionedChannels = (await Channel.findById(channelId)).category === "private";

        // Create feed for user
        let squeals = await createFeedForUser(req.user.id, channelId, searchInMentionedChannels);

        // Send the squeals as the response
        res.status(200).json(squeals);
    } catch (error) {
        next(error);
    }
}

// React to squeal
exports.reactToSqueal = async (req, res, next) => {

    try {

        // Get squeal id
        const squealId = req.params.squealId;

        // Get reaction id
        const reactionId = req.params.reactionId;

        // Get reaction from database
        let reaction = await Reaction.findById(reactionId);

        // Get squeal from database
        let squeal = await Squeal.findById(squealId)
            .populate('reactions')
            .select('+reactions.users')
            .select('+positiveReactions')
            .select('+negativeReactions');

        // Check if squeal exists
        if (!squeal)
            return res.status(404).json({error: 'Squeal non trovato'});


        // Check if reaction exists
        if (!squeal.reactions.find(reaction => reaction.reactionId.toHexString() === reactionId))
            return res.status(404).json({error: 'Reaction non trovata'});

        // Reaction exists, check if user has already reacted to squeal
        if (squeal.reactions.find(reaction => reaction.reactionId.toHexString() === reactionId).users.includes(req.user.id)) {

            // User has already reacted to squeal
            return res.status(400).json({error: 'Hai già reagito a questo Squeal con questa Reaction'});
        }

        // User has not reacted to squeal, add user to reaction
        let targetReaction = squeal.reactions.find(reaction => reaction.reactionId.toHexString() === reactionId);
        targetReaction.count++;
        targetReaction.users.push(req.user.id);

        // Increment positive or negative reactions count
        if (reaction.positive) squeal.positiveReactions++;
        else squeal.negativeReactions++;

        // Save squeal
        await squeal.save();

        // Return squeal as response
        res.status(200).json(await Squeal.findById(squealId));

    } catch (error) {
        next(error);
    }
}

// Unreact to squeal
exports.unreactToSqueal = async (req, res, next) => {

    // Get squeal id
    const squealId = req.params.squealId;

    // Get reaction id
    const reactionId = req.params.reactionId;

    // Get reaction from database
    let reaction = await Reaction.findById(reactionId);

    try {

        // Get squeal from database
        let squeal = await Squeal.findById(squealId)
            .populate('reactions')
            .select('+reactions.users')
            .select('+positiveReactions')
            .select('+negativeReactions');

        // Check if squeal exists
        if (!squeal) {
            return res.status(404).json({error: 'Squeal non trovato'});
        }

        // Check if reaction exists
        if (!squeal.reactions.find(reaction => reaction.reactionId.toHexString() === reactionId)) {
            return res.status(404).json({error: 'Reaction non trovata'});
        }

        // Reaction exists, check if user has already reacted to squeal
        if (!squeal.reactions.find(reaction => reaction.reactionId.toHexString() === reactionId).users.includes(req.user.id)) {

            // User has not reacted to squeal
            return res.status(400).json({error: 'Non hai ancora reagito a questo Squeal con questa Reaction'});
        }

        // User has reacted to squeal, remove user from reaction
        let targetReaction = squeal.reactions.find(reaction => reaction.reactionId.toHexString() === reactionId);
        targetReaction.count--;

        // Remove user from reaction
        targetReaction.users = targetReaction.users.filter(userId => userId.toHexString() !== req.user.id);

        // Decrement positive or negative reactions count
        if (reaction.positive) squeal.positiveReactions--;
        else squeal.negativeReactions--;

        // Save squeal
        await squeal.save();

        // Return squeal as response
        return res.status(200).json(await Squeal.findById(squealId));

    }catch (error) {
        next(error);
    }
}

// Add impression to squeal
exports.addImpression = async (req, res, next) => {

    // Get squeal id
    const squealId = req.params.squealId;

    try {

        // Get squeal from database
        let squeal = await Squeal.findById(squealId)
            .select('+impressions');

        // Check if squeal exists
        if (!squeal) {
            return res.status(404).json({error: 'Squeal non trovato'});
        }

        // Increment impression count
        squeal.impressions++;

        // Save squeal
        squeal.save();

        // Return squeal as response
        return res.status(200).json(await Squeal.findById(squealId));

    } catch (error) {
        next(error);
    }
}

// Get all reactions
exports.getAllReactions = async (req, res, next) => {

    try {

        // Get all reactions
        let reactions = await Reaction.find();

        // Send the reactions as the response
        res.status(200).json(reactions);
    } catch (error) {
        next(error);
    }
}

// Returns the name of the quota that has been exceeded, or null if no quota has been exceeded
async function checkIfExceedsQuota(userId, squeal) {

    // Get current date
    const currentDate = new Date();

    // Get new squeal quota (based on content type, text characters count or 125 if image or map)
    const squealQuota = squeal.contentType === "text"
        ? squeal.content.length
        : 125;

    // Re-get user from database this time with quota fields
    let user = await User.findById(userId).select('quota');

    // Check if daily quota has been exceeded
    if (user.quota.dailyQuotaUsed + squealQuota > user.quota.dailyQuotaMax) {


        // Check if daily quota reset date is in the past
        if (user.quota.dailyQuotaReset < currentDate) {
            user.quota.dailyQuotaUsed = 0;
            user.quota.dailyQuotaReset = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
            user.save();
        } else {
            return 'giornaliera';
        }
    }

    // Check if weekly quota has been exceeded
    if (user.quota.weeklyQuotaUsed + squealQuota > user.quota.weeklyQuotaMax) {

        // Check if weekly quota reset date is in the past
        if (user.quota.weeklyQuotaReset < currentDate) {
            user.quota.weeklyQuotaUsed = 0;
            user.quota.weeklyQuotaReset = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
            user.save();
        } else {
            return 'settimanale';
        }
    }

    // Check if monthly quota has been exceeded
    if (user.quota.monthlyQuotaUsed + squealQuota > user.quota.monthlyQuotaMax) {

        // Check if monthly quota reset date is in the past
        if (user.quota.monthlyQuotaReset < currentDate) {
            user.quota.monthlyQuotaUsed = 0;
            user.quota.monthlyQuotaReset = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
            user.save();
        } else {
            return 'mensile';
        }
    }

    // Update user quota
    user.quota.dailyQuotaUsed += squealQuota;
    user.quota.weeklyQuotaUsed += squealQuota;
    user.quota.monthlyQuotaUsed += squealQuota;

    // Save user
    user.save();

    // No quota exceeded
    return null;
}

// Returns a list of squeals posted in the channels that the user is subscribed to (or in the channel provided as filter)
async function createFeedForUser(userId, channelIdFilter = null, searchInMentionedChannels = false) {
    // Get user from id
    let user = await User.findById(userId).select("+subscribedChannels").select("+privateChannelId");

    // Now decide if filter out by subscribed channels or by channel id (if provided)
    let channelsToFilter = channelIdFilter ? [channelIdFilter] : user.subscribedChannels;

    // Decide if search in mentioned channels or in posted in channels
    let initialQuery = searchInMentionedChannels
        ? Squeal.find({mentionedChannels: {$in: channelsToFilter}})  // Search on mentionedChannels field of all squeals
        : Squeal.find({postedInChannels: {$in: channelsToFilter}});  // Search on postedInChannels field of all squeals

    // Get all squeals from the database that are posted in the channels selected
    let result = initialQuery
        .sort({createdAt: -1})
        .populate('createdBy')
        .populate('postedInChannels')
        .populate('replyTo')
        .populate('reactions')
        .select('+reactions.users')
        .lean()
        .limit(50);

    // Search on postedInChannels field of all squeals and remove
    // every private channel (privacy) for exception to his own private channel
    let squeals = await result.exec();
    squeals.forEach(squeal => {
        squeal.postedInChannels = squeal.postedInChannels
            .filter(channel => channel.category !== "private" || channel._id == user.privateChannelId.toHexString());

        // Check if logged user reacted to squeal
        squeal.reactions.forEach(reaction => {

            // Check if user reacted to squeal
            reaction.users.forEach(userId => {
                if (userId.toHexString() === user._id.toHexString()) {
                    reaction.userReacted = true;
                }
            });

            // Remove users array from reaction
            delete reaction.users;
        });
    });

    return squeals;
}

async function createSqueal(squealData, userId, postInChannels)
{
    // Create squeal
    let squeal = new Squeal(squealData);
    squeal.createdBy = userId;
    squeal.postedInChannels = postInChannels;

    //Create new empty reactions array with 0 reactions for each reaction
    let reactions = await Reaction.find();
    reactions.forEach(reaction => {
        squeal.reactions.push({
            reactionId: reaction._id,
            users: [],
            count: 0
        });
    });

    // Save squeal
    let savedSqueal = await squeal.save();

    return savedSqueal;
}