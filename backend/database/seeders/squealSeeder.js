const Squeal = require('../../models/squealModel');
const User = require('../../models/userModel');

function seed() {

    // Delete all squeals
    Squeal.deleteMany({}).then(() => {

    // Foreach squeal data, use the first available user id
    User.find()
        .then((users) => {

                // Set the user id for each squeal
                squealData.forEach((squeal) => {
                    squeal.createdBy = users[0]._id;
                });

                // Insert the squeal data
                Squeal.insertMany(squealData)
                    .then(() => {
                        console.log('Squeal data seeded successfully');
                    })
                    .catch((err) => {
                        console.error('Error seeding squeal data:', err);
                    });
            }
        );
    });
}

const squealData = [
    {
        userId: "", // Set in seed()
        content: "asf",
        contentType: 0,
        impressions: 0,
        positiveReactions: 0,
        negativeReactions: 0,
        popularity: 0,
        category: 0,
    }
];

module.exports = {seed};