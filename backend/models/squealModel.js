const mongoose = require('mongoose');

// contentType:
// 0: text
// 1: image
// 2: map

// category:
// 0: private (@)
// 1: public and user administrated (§)
// 2: PUBLIC BUT REDAZIONE (§)
// 3: hashtagged (#)

const squealSchema = new mongoose.Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    content: String,
    contentType: Number,
    impressions: Number,
    positiveReactions: Number,
    negativeReactions: Number,
    popularity: Number,
    createdAt: { type: Date, default: Date.now},
    category: Number,
});

const SquealModel = mongoose.model('Squeal', squealSchema);

module.exports = SquealModel;