const Squeal = require('../../models/squealModel');
const User = require('../../models/userModel');

async function seed() {

    // Delete all squeals
    await Squeal.deleteMany({});

    // Foreach squeal data, use the first available user id
    let users = await User.find();

    // Set the user id for each squeal
    squealData.forEach((squeal) => {
        squeal.createdBy = users[0]._id;
    });

    // Insert the squeal data
    await Squeal.insertMany(squealData);
}

const squealData = [
    {
        userId: "", // Set in seed()
        content: "asf",
        contentType: "text",
        impressions: [],
        positiveReactions: 0,
        negativeReactions: 0,
        popularity: 0,
    }
];

module.exports = {seed};