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
        name: "§CONTROVERSIAL",
        category: "editorial",
        admins: [],
        description: "Tutti gli squeal che stanno facendo discutere il mondo",
    },
    {
        name: "$TOP_100",
        category: "editorial",
        admins: [],
        description: "I migliori squeal del momento",
    },
    {
        name: "§SPORT",
        category: "editorial",
        admins: [],
        description: "Tutti gli squeal sul mondo dello sport",
    },
    {
        name: "§NEWS",
        category: "editorial",
        admins: [],
        description: "Tutti gli squeal sulle ultime notizie",
    },
    {
        name: "§GOSSIP",
        category: "editorial",
        admins: [],
        description: "Tutti gli squeal sul mondo del gossip",
    },
    {
        name: "§TECH",
        category: "editorial",
        admins: [],
        description: "Tutti gli squeal sul mondo della tecnologia",
    }
];

module.exports = { seed };