const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    token: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now},
});

const AccessTokenModel = mongoose.model('AccessToken', accessTokenSchema);

module.exports = AccessTokenModel;