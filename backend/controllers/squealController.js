const Squeal = require('../models/squealModel');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');
const Reaction = require('../models/reactionModel');
let SquealTrendHelper = require('../helpers/squealTrendHelper');
const UserController = require('./userController');
const multer = require('multer');
const path = require("path");
const {json} = require("express");

// Feed for user
exports.getFeed = async (req, res, next) => {
    try {

        // Get query for search
        const searchQuery = req.query.search;

        // Create feed for user
        const squeals = await createFeedForUser(req.user.id, null, false, searchQuery)

        // Send the squeals as the response
        res.status(200).json(squeals);
    } catch (error) {
        next(error);
    }
};

// Create a new squeal
exports.createSqueal = async (req, res, next) => {

    // Return if user is guest
    if (req.user.type === "guest") {
        return res.status(403).json({error: 'Non sei un utente registrato'});
    }

    try {

        // Check if smm is creating squeal, in this case createdBy is smm managed user
        let user = await User.findById(req.user.id).select('+privateChannelId');
        if(user.type === "smm")
        {
            // Get user to be managed
            user = await User.findOne({smmId: req.user.id}).select('+privateChannelId');
        }

        // Get channels to post in
        let channelsArray = req.body.channels;

        // Get actual squeal content
        const squealData = req.body.squeal;

        // Parse hashtag channels
        channelsArray = await filterHashtagChannels(channelsArray);

        // Check if provided channels are all valid
        const validChannels = await Channel.find({_id: {$in: channelsArray}});
        if (validChannels.length !== channelsArray.length) {
            return res.status(400).json({error: 'Almeno uno dei canali forniti non é stato trovato'});
        }

        // Check if at least one channel is not private (in this case we should check quota)
        let shouldCheckQuota = false;
        validChannels.forEach(channel => {

            // Found channel that is not private, so we should check quota
            if (channel.category !== 'private') {
                shouldCheckQuota = true;
            }
        });

        // Check if user has exceeded quota
        if (shouldCheckQuota) {
            let quotaExceeded = await checkIfExceedsQuota(user._id.toHexString(), squealData)
            if (quotaExceeded)
                return res.status(400).json({error: `Hai superato la quota ${quotaExceeded}`});
        }

        // Add squeal to user's private channel
        channelsArray.push(user.privateChannelId);

        // No quota was exceeded, create a new squeal
        let squeal = await createSqueal(squealData, user._id.toHexString(), channelsArray);

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
    if(!req.file)
    {
        return res.status(400).json({error: 'Nessun file caricato'});
    }
    squeal.mediaUrl = "/storage/" + path.basename(req.file.path);

    // Save squeal
    await squeal.save();

    // Return squeal as response
    res.status(200).json(squeal);
}

// Search squeals by channel name
exports.searchByChannelName = async (req, res, next) => {

    // Take channel name
    let channelName = req.params.channelName;

    // Take channel type
    const channelType = req.params.channelType;

    // Check if needs to search in mentioned or posted channels
    const searchInMentionedChannels = req.params.searchIn === "mentioned";
    if(searchInMentionedChannels)
    {
        switch (channelType) {
            case "channel":
                channelName = "§" + channelName;
                break;
            case "user":
                channelName = "@" + channelName;
                break;
            case "hashtag":
                channelName = "#" + channelName;
                break;
        }

        try {

            // Create feed for user
            let squeals = await createFeedForUser(req.user.id, null, true, channelName);

            // Send the squeals as the response
            res.status(200).json(squeals);
            return;
        } catch (error) {
            next(error);
        }
    }

    let channelIds = []

    // If channel type is user, search users with that username and take their private channel id
    if (channelType === "user") {
        let users = await User.find({username: {$regex: channelName, $options: 'i'}}).select('privateChannelId');
        channelIds = users.map(user => user.privateChannelId);
    }

    // Put together editorial and public channels as channel
    else if (channelType === "channel"){
        // Take all channel ids that contains the channel name
        channelIds = (await Channel.find({
            name: {$regex: channelName, $options: 'i'},
            category: {$in: ["editorial", "public"]}
        })).map(channel => channel._id);
    }

    // HashTag
    else {
        // Take all channel ids that contains the channel name
        channelIds = (await Channel.find({
            name: {$regex: channelName, $options: 'i'},
            category: channelType
        })).map(channel => channel._id);
    }

    try {

        // Create feed for user
        let squeals = await createFeedForUser(req.user.id, channelIds, searchInMentionedChannels);

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

        // Update squeal trend
        await SquealTrendHelper.updateSquealTrend(squealId);

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

        // Update squeal trend
        await SquealTrendHelper.updateSquealTrend(squealId);

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

        // Add logged user to impressions (if not already present)
        if (!squeal.impressions.includes(req.user.id)) {
            squeal.impressions.push(req.user.id);
        }else{
            return res.status(200).json();
        }

        // Save squeal
        squeal.save();

        // Update squeal trend
        await SquealTrendHelper.updateSquealTrend(squealId);

        // Return squeal as response
        return res.status(200).json();

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

// Squeal feed for moderator
exports.getAllSqueals = async (req, res, next) => {

    // Return if not moderator
    if (req.user.type !== "moderator") {
        return res.status(403).json({error: 'Non sei un moderatore'});
    }

    return res.status(200).json(await Squeal.find().populate('createdBy').populate('postedInChannels').populate({
        path: 'replyTo',
        populate: {
            path: 'createdBy',
            model: 'User'
        }
    }).populate('reactions'));
}

// Update squeal for moderator
exports.updateSqueal = async (req, res, next) => {

    // Return if not moderator
    if (req.user.type !== "moderator") {
        return res.status(403).json({error: 'Non sei un moderatore'});
    }

    // Get squeal id
    const squealId = req.params.squealId;

    // Get squeal from database
    let squeal = await Squeal.findById(squealId).select('+reactions').populate('reactions');
    console.log(squeal);

    // Check if squeal exists
    if (!squeal) {
        return res.status(404).json({error: 'Squeal non trovato'});
    }

    // Update squeal
    squeal.postedInChannels = req.body.postedInChannels;

    // Add fake reactions
    for (let i = 0; i < req.body.reactions.length; i++) {
        if(!req.body.reactions[i])
            continue;
        let target = squeal.reactions.filter(reaction => reaction.reactionId.toHexString() === req.body.reactions[i].reactionId)[0];
        if (target) {
            target.count = req.body.reactions[i].count;
        }
    }

    // Save squeal
    await squeal.save();

    // Return squeal as response
    res.status(200).json(squeal);
}


// Returns the name of the quota that has been exceeded, or null if no quota has been exceeded
async function checkIfExceedsQuota(userId, squeal) {

    // Get current date
    const currentDate = new Date();

    // Get new squeal quota (based on content type, text characters count or 125 if image or map)
    const squealQuota = squeal.contentType === "text"
        ?  squeal.content.match(/<[^>]*>([^<]*)<\/[^>]*>/)[1].trim().length
        : 125;

    // Re-get user from database this time with quota fields
    let user = await User.findById(userId).select('quota');

    // Check if daily quota has been exceeded
    if (user.quota.dailyQuotaUsed + squealQuota > user.quota.dailyQuotaMax) {


        // Check if daily quota reset date is in the past
        if (user.quota.dailyQuotaReset < currentDate) {
            user.quota.dailyQuotaUsed = 0;
            user.quota.dailyQuotaReset = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
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
async function createFeedForUser(userId, filterChannels = null, searchInMentionedChannels = false, searchQuery = null) {

    // Get user from id
    let user = await User.findById(userId).select("+subscribedChannels").select("+privateChannelId");

    // Build channel array to filter (if filterChannels is not explicitly provided for search purposes)
    if (!filterChannels && searchQuery == null) {

        // Editorial channels are always included (get their ids)
        filterChannels = (await Channel.find({category: "editorial"})).map(channel => channel._id);

        // If user is not guest, append his subscribed channels
        if (user.type !== "guest") {
            filterChannels.push(...user.subscribedChannels);
        }
    }

    // Build query based on different cases
    let query;
    if (searchQuery != null) {
        query = Squeal.find({
            $or: [
                {content: {$regex: searchQuery, $options: 'i'}},
            ]
        });
    } else if (searchInMentionedChannels) {
        query = Squeal.find({mentionedChannels: {$in: filterChannels}});
    } else {
        query = Squeal.find({postedInChannels: {$in: filterChannels}});
    }

    // Get all squeals from the database that are posted in the channels selected
    let result = query
        .sort({createdAt: -1})
        .populate('createdBy')
        .populate('postedInChannels')
        .populate({
            path: 'replyTo',
            populate: {
                path: 'createdBy',
                model: 'User'
            }
        })
        .populate('reactions')
        .select('+reactions.users')
        .lean()
        .limit(100);

    // Cycle on each squeal to perform various operations
    let squeals = await result.exec();


    for(let i = 0; i < squeals.length; i++)
    {
        // Remove every private channel (privacy) for exception to his own private channel
        if(squeals[i].createdBy._id.toHexString() !== user._id.toHexString())
        {
            squeals[i].postedInChannels = squeals[i].postedInChannels
                .filter(channel => channel.category !== "private" || channel._id == user.privateChannelId.toHexString());
        }


        // User who created squeal should be able to see also private channels
        for(let j = 0; j < squeals[i].postedInChannels.length; j++)
        {
            if (squeals[i].postedInChannels[j].category === "private") {
                let a = await User.findOne({privateChannelId: squeals[i].postedInChannels[j]._id.toHexString()}).select('username');
                squeals[i].postedInChannels[j].name = '@'+a.username;
            }
        }

        // Cycle on each reaction of squeal
        squeals[i].reactions.forEach(reaction => {

            // Check if user reacted to squeal
            reaction.users.forEach(userId => {
                if (userId.toHexString() === user._id.toHexString()) {
                    reaction.userReacted = true;
                }
            });

            // Update count of reaction with delta adjusted from moderator
            //reaction.count += reaction.delta;

            // Remove users array from reaction
            delete reaction.users;
        });
    }

    return squeals;
}

async function createSqueal(squealData, userId, postInChannels)
{

    // Create squeal
    let squeal = new Squeal(squealData);
    squeal.createdBy = userId;

    // Add channels to squeal
    squeal.postedInChannels = postInChannels;


    // Check if squeal is a reply
    if(squeal.replyTo)
    {
        // Get replied squeal
        let repliedSqueal = await Squeal.findById(squeal.replyTo).select('postedInChannels');

        // Throw error if replied squeal does not exist
        if(!repliedSqueal)
            throw new Error('Squeal a cui rispondere non trovato');

        // Set replied squeal as replied to
        squeal.replyTo = repliedSqueal._id;

        // Copy channels from replied squeal except from private
        squeal.postedInChannels = repliedSqueal.postedInChannels.filter(channel => channel.category !== "private");
    }

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
    return await squeal.save();
}

async function filterHashtagChannels(postInChannels) {
    let hashtagChannels = postInChannels.filter(channel => channel.startsWith("#"));
    postInChannels = postInChannels.filter(channel => !channel.startsWith("#"));

    for (const channel of hashtagChannels) {
        let existingChannel = await Channel.where({ name: channel, category: "hashtag" });

        if (existingChannel.length === 0) {
            var newChannel = new Channel({
                name: channel,
                category: "hashtag"
            });

            newChannel = await newChannel.save();
            postInChannels.push(newChannel._id);
        } else {
            postInChannels.push(existingChannel[0]._id.toHexString());
        }
    }

    console.log(postInChannels);
    return postInChannels;
}


// function parseMentioned(htmlString) {
//     // Create a temporary div element to parse the HTML string
//     var tempDiv = document.createElement('div');
//     tempDiv.innerHTML = htmlString;
//
//     // Find all elements with class 'highlight'
//     var highlightedElements = tempDiv.getElementsByClassName('highlight');
//
//     // Initialize arrays for each category
//     var atSymbols = [];
//     var hashSymbols = [];
//     var sectionSymbols = [];
//
//     // Iterate through the matching elements
//     for (var i = 0; i < highlightedElements.length; i++) {
//         var text = highlightedElements[i].textContent.trim();
//
//         // Check if the text starts with '@', '#', or '§' and categorize accordingly
//         if (text.startsWith('@')) {
//             atSymbols.push(text);
//         } else if (text.startsWith('#')) {
//             hashSymbols.push(text);
//         } else if (text.startsWith('§')) {
//             sectionSymbols.push(text);
//         }
//         // Ignore elements that don't start with the specified symbols
//     }
//
//     // Create an object to hold the categorized arrays
//     var result = {
//         atSymbols: atSymbols,
//         hashSymbols: hashSymbols,
//         sectionSymbols: sectionSymbols
//     };
//
//     // Find requested channels in db
//
//
//     return result;
// }
