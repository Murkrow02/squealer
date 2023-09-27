const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, select: false},
    password: {type: String, select: false},
    type: Number,
    subscribedChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel", select: false}],
    smmId: {type: mongoose.Schema.Types.ObjectId, ref: "User", select: false},
    __v: {type: Number, select: false},
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
