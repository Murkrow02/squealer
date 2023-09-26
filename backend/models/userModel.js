const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, //Hashed
    type: Number,
    subscribedChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel"}],
    smmId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
