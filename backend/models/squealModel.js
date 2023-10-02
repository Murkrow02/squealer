const mongoose = require('mongoose');

// contentType:
// 0: text
// 1: image
// 2: map

const squealSchema = new mongoose.Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: String,
    contentType: {type: String, enum: ['text', 'image', 'map']},
    impressions: {type: Number, default: 0},
    positiveReactions: {type: Number, default: 0, select: false},
    negativeReactions: {type: Number, default: 0, select: false},
    popularity: {type: Number, default: 0},
    reactions: {
        type: [{
            reactionId: {type: mongoose.Schema.Types.ObjectId, ref: "Reaction"},
            users: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        }],
    },
    createdAt: { type: Date, default: Date.now},
    postedInChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel"}],
    mentionedChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel"}],
});

const SquealModel = mongoose.model('Squeal', squealSchema);

module.exports = SquealModel;