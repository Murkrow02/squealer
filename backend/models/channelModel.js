const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    type: Number,
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    description: String,
});

const ChannelModel = mongoose.model('Channel', channelSchema);

module.exports = ChannelModel;
