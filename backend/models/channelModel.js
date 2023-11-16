const mongoose = require('mongoose');

// category:
// 0: private (@)
// 1: public and user administrated (§)
// 2: editorial (§)
// 3: hashtag (#)

const channelSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: String,
    category: {type: String, enum: ['private', 'public', 'editorial', 'hashtag']},
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: "User", select: false}],
    description: {type: String, select: true},
    banned: [{type: mongoose.Schema.Types.ObjectId, ref: "User", select: false}],
    __v: {type: Number, select: false},
});

const ChannelModel = mongoose.model('Channel', channelSchema);

module.exports = ChannelModel;
