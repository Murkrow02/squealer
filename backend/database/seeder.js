const UserSeeder = require('./seeders/UserSeeder');
const SquealSeeder = require('./seeders/SquealSeeder');
const ChannelSeeder = require('./seeders/ChannelSeeder');

function seed()
{
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
}

module.exports = { seed };