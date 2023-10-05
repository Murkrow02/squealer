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
    {
        name: "",
        category: "private",
        admins: [],
        description: "",
    },
    {
        name: "§maiz",
        category: "public",
        admins: [],
        description: "gessi",
    },
    {
        name: "§MAIZ",
        category: "editorial",
        admins: [],
        description: "pila",
    },
    {
        name: "#maiz",
        category: "hashtag",
        admins: [],
        description: "yo",
    },
];

module.exports = { seed };