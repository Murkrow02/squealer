const Reaction = require("../../models/reactionModel");
const mongoose = require("mongoose");

async function seed(){

    // Create reactions
    await Reaction.create([
        {
            name: "like",
            emoji: "👍",
            positive: true,
        },
        {
            name: "dislike",
            emoji: "👎",
            positive: false,
        },
        {
            name: "love",
            emoji: "❤️",
            positive: true,
        },
        {
            name: "laugh",
            emoji: "😂",
            positive: true,
        },
        {
            name: "anger",
            emoji: "😡",
            positive: false,
        }
    ]);
}

module.exports = { seed };