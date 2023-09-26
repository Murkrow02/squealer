const mongoose = require('mongoose');

const squealChannelSchema = new mongoose.Schema({
    squealId: {type: mongoose.Schema.Types.ObjectId, ref: "Squeal"},
    channelId: {type: mongoose.Schema.Types.ObjectId, ref: "Channel"},
});

const SquealChannelModel = mongoose.model('SquealChannel', squealChannelSchema);

module.exports = SquealChannelModel;