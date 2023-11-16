const UserSeeder = require('./seeders/userSeeder');
const SquealSeeder = require('./seeders/squealSeeder');
const ChannelSeeder = require('./seeders/channelSeeder');
const ReactionSeeder = require('./seeders/reactionSeeder');
const User = require('../models/userModel');

async function seed() {

    // Check if at least one user is already in db
    let usersCount = await User.countDocuments({});

    // If there is at least one user, don't seed
    if (usersCount > 0)
        return;

    // Reactions
    await ReactionSeeder.seed();

    //Users
    await UserSeeder.seed();

    //Channel
    await ChannelSeeder.seed();

    //Squeal
    await SquealSeeder.seed();
}

module.exports = {seed};