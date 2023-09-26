const UserSeeder = require('./seeders/UserSeeder');
const SquealSeeder = require('./seeders/SquealSeeder');
const ChannelSeeder = require('./seeders/ChannelSeeder');

function seed()
{
    UserSeeder.seed();
    ChannelSeeder.seed();
    SquealSeeder.seed();
}

module.exports = { seed };