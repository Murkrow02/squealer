const mongoose = require('mongoose');

// contentType:
// 0: text
// 1: image
// 2: map

const squealSchema = new mongoose.Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: String,
    contentType: {type: String, enum: ['text', 'media', 'map']},
    impressions: {type: Number, default: 0, select: false},
    positiveReactions: {type: Number, default: 0, select: false},
    negativeReactions: {type: Number, default: 0, select: false},
    popularity: {type: Number, default: 0, select: false},
    reactions: {
        type: [{
            _id: false,
            reactionId: {type: mongoose.Schema.Types.ObjectId, ref: "Reaction"},
            users: [{type: mongoose.Schema.Types.ObjectId, ref: "User", select: false}],
            count: {type: Number, default: 0},
        }],
    },
    createdAt: { type: Date, default: Date.now},
    postedInChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel"}],
    mentionedChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel"}],
    mapPoints : [{type: Object}],
    mediaUrl: {type: String, select: false},
    __v: {type: Number, select: false},
});

const SquealModel = mongoose.model('Squeal', squealSchema);

module.exports = SquealModel;