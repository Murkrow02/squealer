const mongoose = require('mongoose');

// type:
// -1: blocked
// 0: user
// 1: smm
// 2: moderator

const userSchema = new mongoose.Schema({
    username: String,
    email: {type: String, select: false},
    password: {type: String, select: false},
    type: {type: String, enum: ['guest','blocked','user', 'smm', 'moderator']},
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
    karma: {
        type:{
            popularSquealCount: {type: Number, default: 0, select: true},
            impopularSquealCount: {type: Number, default: 0, select: true},
        }, select: false
    },
    popularSquealCount: {type: Number, default: 0, select: false},
    unpopularSquealCount: {type: Number, default: 0, select: false},
    createdChannels: [{type: mongoose.Schema.Types.ObjectId, ref: "Channel", select: false}],
    privateChannelId: {type: mongoose.Schema.Types.ObjectId, ref: "Channel", select: false}, // Used for private messaging
    __v: {type: Number, select: false},
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
