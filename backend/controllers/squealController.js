const Squeal = require('../models/squealModel');
const SquealChannel = require('../models/squealChannelModel');
const Channel = require('../models/channelModel');
const User = require('../models/userModel');

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
                return res.status(400).json({ error: `Hai superato la quota ${quotaExceeded}` });
        }

        // No quota was exceeded, create a new squeal
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

// Returns the name of the quota that has been exceeded, or null if no quota has been exceeded
async function checkIfExceedsQuota(userId, squeal) {

    // Get current date
    const currentDate = new Date();

    // Get new squeal quota (based on content type, text characters count or 125 if image or map)
    const squealQuota = squeal.contentType === 0
        ? squeal.content.length
        : 125;

    // Re-get user from database this time with quota fields
    let user = await User.findById(userId).select('quota');

    console.log(squealQuota);
    console.log(user.quota.dailyQuotaUsed);
    console.log(user.quota.dailyQuotaMax);

    // Check if daily quota has been exceeded
    if (user.quota.dailyQuotaUsed + squealQuota > user.quota.dailyQuotaMax) {


        // Check if daily quota reset date is in the past
        if (user.quota.dailyQuotaReset < currentDate) {
            user.quota.dailyQuotaUsed = 0;
            user.quota.dailyQuotaReset = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
            user.save();
        }else{
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
        }
        else{
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
            }
            else{
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
