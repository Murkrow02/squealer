const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, select: false},
    password: {type: String, select: false},
    type: Number,
    subscribedChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel", select: false}],
    smmId: {type: mongoose.Schema.Types.ObjectId, ref: "User", select: false},
    quota: {
        type: {
            dailyQuotaUsed: {type: Number, select: true},
            dailyQuotaMax: {type: Number, select: true},
            dailyQuotaReset: {type: Date, select: true},
            weeklyQuotaUsed: {type: Number, select: true},
            weeklyQuotaMax: {type: Number, select: true},
            weeklyQuotaReset: {type: Date, select: true},
            monthlyQuotaUsed: {type: Number, select: true},
            monthlyQuotaMax: {type: Number, select: true},
            monthlyQuotaReset: {type: Date, select: true},
        }, select: false
    },
    __v: {type: Number, select: false},
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
