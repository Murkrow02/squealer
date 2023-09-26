const mongoose = require('mongoose');

const squealSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: String,
    contentType: Number,
    impressions: Number,
    positiveReactions: Number,
    negativeReactions: Number,
    popularity: Number,
    createdAt: { type: Date, default: Date.now},
    category: Number,
    smmId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

const AccessTokenModel = mongoose.model('Squeal', squealSchema);

module.exports = AccessTokenModel;