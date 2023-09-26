const Channel = require('../../models/channelModel');

function seed(){
    Channel.insertMany(channelData)
        .then(() => {
            console.log('Channel data seeded successfully');
        })
        .catch((err) => {
            console.error('Error seeding channel data:', err);
        });
}

const channelData = [
    { name: 'Channel 1', description: 'Channel 1 description' },
    { name: 'Channel 2', description: 'Channel 2 description' },
];

module.exports = { seed };