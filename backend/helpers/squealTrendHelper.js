let Squeal = require('../models/squealModel');
let Channel = require('../models/channelModel');
let User = require('../models/userModel');

exports.updateSquealTrend = async (squealId) => {

    // Retrieve squeal from the database
    const squeal = await Squeal.findById(squealId)
        .select('+impressions +positiveReactions +negativeReactions +markedAsPopular +markedAsUnpopular +postedInChannels +createdBy');

    // Calculate critical mass based on impressions
    const criticalMass = calculateCriticalMass(squeal.impressions.length);

    // Get the posting user's ID
    const postingUserId = squeal.createdBy.toHexString();

    // Check the previous states
    const wasPopular = squeal.markedAsPopular;
    const wasUnpopular = squeal.markedAsUnpopular;
    const controversialChannelId = (await Channel.findOne({name: "§CONTROVERSIAL"}))._id.toHexString();
    const wasControversial = squeal.postedInChannels.includes(controversialChannelId);

    if (squeal.positiveReactions > criticalMass) {
        // Mark the squeal as popular or controversial
        await handlePopularOrControversial(squeal, criticalMass, wasPopular, wasUnpopular, wasControversial, postingUserId);
    } else if (squeal.negativeReactions > criticalMass) {
        // Mark the squeal as unpopular
        await handleUnpopular(squeal, wasUnpopular, postingUserId);
    } else {
        // Squeal is not popular, unpopular, or controversial
        await handleNotPopularOrUnpopular(squeal, wasPopular, wasUnpopular, postingUserId);
    }

    // Update the squeal in the database
    await squeal.save();
}

// Calculate the critical mass as 25% of the impressions
function calculateCriticalMass(impressionsCount) {
    return Math.floor(impressionsCount * 0.25);
}

// Handle the case where the squeal is popular or controversial
async function handlePopularOrControversial(squeal, criticalMass, wasPopular, wasUnpopular, wasControversial, postingUserId) {
    if (squeal.negativeReactions > criticalMass && !wasControversial) {
        // Mark the squeal as controversial
        await markSquealAsControversial(squeal, postingUserId);
    } else {
        // Mark the squeal as popular
        await markSquealAsPopular(squeal, postingUserId, wasPopular);
    }
}

// Mark the squeal as controversial
async function markSquealAsControversial(squeal, postingUserId) {

    const controversialChannelId = (await Channel.findOne({name: "§CONTROVERSIAL"}))._id.toHexString();

    // Check if the squeal is already marked as controversial
    if (!squeal.postedInChannels.includes(controversialChannelId)) {
        squeal.postedInChannels.push(controversialChannelId);
    }

    if (squeal.markedAsPopular) {
        // Remove popular mark and update quota
        squeal.markedAsPopular = false;
        await decreasePopularAndUpdateQuota(postingUserId);
    }

    if (squeal.markedAsUnpopular) {
        // Remove unpopular mark and update quota
        squeal.markedAsUnpopular = false;
        await decreaseUnpopularAndUpdateQuota(postingUserId);
    }
}

// Mark the squeal as popular
async function markSquealAsPopular(squeal, postingUserId, wasPopular) {

    if (!wasPopular) {

        console.log(`Marking squeal ${squeal._id} as popular`);

        // Mark the squeal as popular and update quota
        squeal.markedAsPopular = true;
        await increasePopularAndUpdateQuota(postingUserId);
    }
}

// Handle the case where the squeal is unpopular
async function handleUnpopular(squeal, wasUnpopular, postingUserId) {

    if (!wasUnpopular) {

        console.log(`Marking squeal ${squeal._id} as unpopular`);

        // Mark the squeal as unpopular and update quota
        squeal.markedAsUnpopular = true;
        await markSquealAsUnpopularAndUpdateQuota(postingUserId);
    }
}

// Mark the squeal as unpopular and update quota
async function markSquealAsUnpopularAndUpdateQuota(postingUserId) {
    await increaseUnpopularAndUpdateQuota(postingUserId);
}

// Handle the case where the squeal is neither popular nor unpopular
async function handleNotPopularOrUnpopular(squeal, wasPopular, wasUnpopular, postingUserId) {
    if (wasPopular) {
        // Update quota for no longer being popular
        await decreasePopularAndUpdateQuota(postingUserId);
    }

    if (wasUnpopular) {
        // Update quota for no longer being unpopular
        await decreaseUnpopularAndUpdateQuota(postingUserId);
    }
}

increasePopularAndUpdateQuota = async (userId) => {

    let user = await User.findById(userId).select("+popularSquealCount");
    user.popularSquealCount++;

    // Check if needs to be promoted (reached a tenth multiple)
    if (user.popularSquealCount % 10 === 0) {
        await addOnePercentToQuota(userId);
    }

    await user.save();

}

decreasePopularAndUpdateQuota = async (userId) => {

    let user = await User.findById(userId).select("+popularSquealCount");
    user.popularSquealCount--;

    // Check if needs to be demoted (reached a tenth multiple - 1)
    if ((user.popularSquealCount + 1) % 10 === 0) {
        await removeOnePercentFromQuota(userId);
    }

    await user.save();
}

increaseUnpopularAndUpdateQuota = async (userId) => {

    let user = await User.findById(userId).select("+unpopularSquealCount");
    user.unpopularSquealCount++;

    // Check if needs to be demoted (reached a tenth multiple)
    if (user.unpopularSquealCount % 10 === 0) {
        await removeOnePercentFromQuota(userId);
    }

    await user.save();
}

decreaseUnpopularAndUpdateQuota = async (userId) => {

    let user = await User.findById(userId).select("+unpopularSquealCount");
    user.unpopularSquealCount--;

    // Check if needs to be demoted (reached a tenth multiple - 1)
    if ((user.unpopularSquealCount + 1) % 10 === 0) {
        await addOnePercentToQuota(userId);
    }

    await user.save();
}

addOnePercentToQuota = async (userId) => {

    console.log(`Adding one percent to user ${userId}'s quota`);

    let user = await User.findById(userId).select("+quota");

    // Get default quota object
    let defaultQuota = exports.generateDefaultQuotaObject();

    // Add one percent to each quota
    user.quota.dailyQuotaMax += defaultQuota.dailyQuotaMax / 100;
    user.quota.weeklyQuotaMax += defaultQuota.weeklyQuotaMax / 100;
    user.quota.monthlyQuotaMax += defaultQuota.monthlyQuotaMax / 100;

    await user.save();
}

removeOnePercentFromQuota = async (userId) => {

    console.log(`Removing one percent from user ${userId}'s quota`);

    let user = await User.findById(userId).select("+quota");

    // Get default quota object
    let defaultQuota = generateDefaultQuotaObject();

    // Remove one percent from each quota
    user.quota.dailyQuotaMax -= defaultQuota.dailyQuotaMax / 100;
    user.quota.weeklyQuotaMax -= defaultQuota.weeklyQuotaMax / 100;
    user.quota.monthlyQuotaMax -= defaultQuota.monthlyQuotaMax / 100;

    await user.save();
}

function generateDefaultQuotaObject () {
    return {
        dailyQuotaUsed: 0,
        dailyQuotaMax: 500,
        dailyQuotaReset: Date.now() + 1000 * 60 * 60 * 24,
        weeklyQuotaUsed: 0,
        weeklyQuotaMax: 5000,
        weeklyQuotaReset: Date.now() + 1000 * 60 * 60 * 24 * 7,
        monthlyQuotaUsed: 0,
        monthlyQuotaMax: 50000,
        monthlyQuotaReset: Date.now() + 1000 * 60 * 60 * 24 * 30,
    }
}

exports.generateDefaultQuotaObject = generateDefaultQuotaObject;