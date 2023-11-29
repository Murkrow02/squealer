const Squeal = require('../../models/squealModel');
const User = require('../../models/userModel');
const Channel = require('../../models/channelModel');
const Reaction = require('../../models/reactionModel');
async function seed() {


    // Get first 50 users
    const users = await User.find({}).limit(50).select('+privateChannelId');

    // Post squeal from each user
    const squeals = [];
    let reactions = await Reaction.find();

    // Get all editorial channels
    const channel = await Channel.find({category: "editorial"});

    users.forEach((user) => {

        // Number of squeal for each user (from 5 to 15)
        const squealNum = Math.floor(Math.random() * 10) + 5;

        // Generate squeal data
        for (let i = 0; i < squealNum; i++) {
            let squealData = {
                content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>",
                contentType: "text",
                postedInChannels: [],
                createdBy: user._id,
                reactions: [],
            };

            // Add squeal to random channel
            let randomChannel = channel[Math.floor(Math.random() * channel.length)];
            squealData.postedInChannels.push(randomChannel._id.toHexString());
            squealData.postedInChannels.push(user.privateChannelId.toHexString());

            //Create new empty reactions array with 0 reactions for each reaction
            reactions.forEach(reaction => {

                let count = Math.floor(Math.random() * 10);
                squealData.reactions.push({
                    reactionId: reaction._id,
                    users: [],
                    count: count,
                });

                // Update positive/negative reactions count
                if (reaction.positive === true) {
                    squealData.positiveReactions = count;
                } else {
                    squealData.negativeReactions = count;
                }
            });

            // Insert the squeal data
            squeals.push(squealData);
        }
    });

    // Insert the squeal data
    await Squeal.insertMany(squeals);
}


module.exports = {seed};