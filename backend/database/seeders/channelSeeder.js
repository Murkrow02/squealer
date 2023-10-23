const Channel = require('../../models/channelModel');
const mongoose = require("mongoose");

async function seed(){

    // Delete all channels
    await Channel.deleteMany({});

    // Add a lot of mock editorial channels to channelData
    for (let i = 0; i < 100; i++) {
        channelData.push({
            name: "§MAIZ" + i,
            category: "editorial",
            admins: [],
            description: "pila",
        });
    }

    // Insert channels
    return Channel.insertMany(channelData)
}

const channelData = [

    // DO NOT REMOVE THIS IN PROD
    {
        name: "§CONTROVERSIAL",
        category: "editorial",
        admins: [],
        description: "Tutti gli squeal che stanno facendo discutere il mondo",
    }
];

module.exports = { seed };