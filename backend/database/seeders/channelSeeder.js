const Channel = require('../../models/channelModel');
const mongoose = require("mongoose");

async function seed(){

    // Delete all channels
    await Channel.deleteMany({});

    // Insert channels
    return Channel.insertMany(channelData)
}

const channelData = [
    {
        name: "Channel 1",
        type: 1,
        admins: [],
        description: "Bel canale proprio",
    },
    {
        name: "Channel 2",
        type: 2,
        admins: [],
        description: "Ancora piu bello",
    },
];

module.exports = { seed };