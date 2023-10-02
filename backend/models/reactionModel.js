const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    name: String,
    emoji: String,
    positive: Boolean,
    __v: {type: Number, select: false},
});

const ReactionModel = mongoose.model('Reaction', reactionSchema);

module.exports = ReactionModel;