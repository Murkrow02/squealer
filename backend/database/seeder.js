const UserSeeder = require('./seeders/UserSeeder');
const SquealSeeder = require('./seeders/SquealSeeder');
const ChannelSeeder = require('./seeders/ChannelSeeder');
const User = require('../models/userModel');

function seed()
{
    // Check if at least one user is already in db
    User.countDocuments({}).then((count) => {

        // If there is at least one user, don't seed
        if (count > 0)
            return;

        //Users
        UserSeeder.seed().then(() => {
            console.log('User data seeded successfully');

            //Channel
            ChannelSeeder.seed().then(() => {
                console.log('Channel data seeded successfully');

                //Squeal
                SquealSeeder.seed();
            });
        });
    });
}

module.exports = { seed };