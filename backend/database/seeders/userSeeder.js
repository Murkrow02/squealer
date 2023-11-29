const User = require('../../models/userModel');
const TrendHelper = require("../../helpers/squealTrendHelper");
const Channel = require("../../models/channelModel");
const bcrypt = require('bcryptjs');

async function seed(){

    // Delete all users
    await User.deleteMany({});

    // Create test users
    let usersData = [];
    let usersCount = 50;
    for (let i = 0; i < usersCount; i++) {

        // Create user object
        const newUser = new User({
            username: 'user_' + i,
            password: bcrypt.hashSync('12345678', 10),
            subscribedChannels: [],
            type: 'user',
        });

        // Add user to db
        await newUser.save();
    }

    // Add fv users
    await User.insertMany(fvUsers);

    // Get all users
    usersData = await User.find({}).select('subscribedChannels');

    // Add default quota and private channel
    for (let i = 0; i < usersData.length; i++) {

        let newUser = usersData[i];

        // Create personal channel for the user for private messaging and subscribe to it (only if not guest)
        const personalChannel = new Channel({
            category: "private",
            name: newUser._id + " private",
        });
        await personalChannel.save();
        newUser.privateChannelId = personalChannel._id;
        newUser.subscribedChannels.push(personalChannel._id);

        // Create quota
        newUser.quota = TrendHelper.generateDefaultQuotaObject();
        await newUser.save();
    }

    // Link smm to pro users
    await linkSmmToProUsers();
}

async function linkSmmToProUsers(){

    // Get fvpro
    let fvpro = await User.findOne({username: "fvpro"}).select('+smmId quota');
    let fvsmm = await User.findOne({username: "fvsmm"});
    fvpro.smmId = fvsmm._id.toHexString();

    // Quota almost full
    fvpro.quota.dailyQuotaUsed = fvpro.quota.dailyQuotaMax - 50;
    await fvpro.save();

    // Get osimhen_povero
    let osimhen_povero = await User.findOne({username: "osimhen_povero"}).select('+smmId +unpopularSquealCount quota');
    let smm_osipovero = await User.findOne({username: "smm_osipovero"});
    osimhen_povero.smmId = smm_osipovero._id.toHexString();
    osimhen_povero.unpopularSquealCount = 9;

    // Quota almost full
    osimhen_povero.quota.dailyQuotaUsed = osimhen_povero.quota.dailyQuotaMax - 50;
    await osimhen_povero.save();

    // Get osimhen_ricco
    let osimhen_ricco = await User.findOne({username: "osimhen_ricco"}).select('+smmId +popularSquealCount quota');
    let smm_osiricco = await User.findOne({username: "smm_osiricco"});
    osimhen_ricco.smmId = smm_osiricco._id.toHexString();
    osimhen_ricco.popularSquealCount = 9;

    // Quota almost full
    osimhen_ricco.quota.dailyQuotaUsed = osimhen_ricco.quota.dailyQuotaMax - 50;
    await osimhen_ricco.save();
}

let fvUsers = [
    {
        username: "fv",
        password: bcrypt.hashSync('12345678', 10),
        type: "user",
        subscribedChannels: [],
    },
    {
        username: "fvpro",
        password: bcrypt.hashSync('12345678', 10),
        type: "prouser",
        subscribedChannels: [],
    },
    {
        username: "fvsmm",
        password: bcrypt.hashSync('12345678', 10),
        type: "smm",
        subscribedChannels: [],
    },
    {
        username: "fvmod",
        password: bcrypt.hashSync('12345678', 10),
        type: "moderator",
        subscribedChannels: [],
    },
    {
        username: "osimhen_povero",
        password: bcrypt.hashSync('12345678', 10),
        type: "prouser",
        subscribedChannels: [],
    },
    {
        username: "osimhen_ricco",
        password: bcrypt.hashSync('12345678', 10),
        type: "prouser",
        subscribedChannels: [],
    },
    {
        username: "smm_osiricco",
        password: bcrypt.hashSync('12345678', 10),
        type: "smm",
        subscribedChannels: [],
    },
    {
        username: "smm_osipovero",
        password: bcrypt.hashSync('12345678', 10),
        type: "smm",
        subscribedChannels: [],
    }

]

module.exports = { seed };