const mongoose = require('mongoose');

// contentType:
// 0: text
// 1: image
// 2: map

const squealSchema = new mongoose.Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: String,
    contentType: {type: String, enum: ['text', 'media', 'map']},
    variant: {type: String, enum: ['', 'weather'], default: ''},
    impressions: [{type: mongoose.Schema.Types.ObjectId, ref: "User", select: false, default: []}],
    positiveReactions: {type: Number, default: 0, select: false},
    negativeReactions: {type: Number, default: 0, select: false},
    popularity: {type: Number, default: 0, select: false},
    replyTo: {type: mongoose.Schema.Types.ObjectId, ref: "Squeal"},
    reactions: {
        type: [{
            _id: false,
            reactionId: {type: mongoose.Schema.Types.ObjectId, ref: "Reaction"},
            users: [{type: mongoose.Schema.Types.ObjectId, ref: "User", select: false}],
            count: {type: Number, default: 0},
        }],
    },
    markedAsPopular: {type: Boolean, default: false, select: false},
    markedAsUnpopular: {type: Boolean, default: false, select: false},
    createdAt: { type: Date, default: Date.now},
    postedInChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel"}],
    mentionedChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel"}],
    mapPoints : [{type: Object}],
    mediaUrl: {type: String, select: true},
    __v: {type: Number, select: false},
});

const SquealModel = mongoose.model('Squeal', squealSchema);

module.exports = SquealModel;