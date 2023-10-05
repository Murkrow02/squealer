const User = require('../models/userModel');
const AccessToken = require('../models/accessTokenModel');
const Channel = require('../models/channelModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Redirects
let redirects = {
    "user": "/app",
    "smm": "/smm",
    "moderator": "/moderator"
}

// Login
exports.login = async (req, res) => {

    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username }).select('+password');

    // Check if the user exists
    if (!user) {
        return res.status(401).json({ message: 'Username non registrato' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compareSync(password, user.password);

    // If the password doesn't match
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Password non corretta' });
    }

    //Check if blocked
    if(user.type === 'blocked'){
        return res.status(500).json({ error: 'Account bloccato'});
    }

    // Create a token for the user
    createTokenForUser(user).then((token) => {
        return res.json({ token: token, redirectURL: redirects[user.type] });
    });
};

// Register
exports.register = async (req, res, next) => {

    // Get the username and password from the request body
    const { username, password, email } = req.body;

    // Check for already existing user
    if(await User.findOne({ username })){
        return res.status(401).json({ message: 'Username già registrato' });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
        email: email,
        username: username,
        password: hashedPassword,
        subscribedChannels: [],
        type: 'user',
    });

    // Create quota object for the user
    newUser.quota = generateDefaultQuotaObject();

    try {

        //Save user
        await newUser.save();

        // Create personal channel for the user for private messaging and subscribe to it
        const personalChannel = new Channel({
            category: "private",
            name: newUser._id + " private",
        });
        await personalChannel.save();
        newUser.privateChannelId = personalChannel._id;
        newUser.subscribedChannels.push(personalChannel._id);
        await newUser.save();

        // Return success message
        res.json({ message: 'Registrazione avvenuta con successo' });

    } catch (error) {
        next(error);
    }
};

// Create a token for the user
async function createTokenForUser(user) {

    // Generate a random token for the user
    const token = crypto.randomBytes(32).toString('hex');

    // Create a new access token with the generated token and the user id
    const accessToken = new AccessToken({
        userId: user._id,
        token: token,
    });

    // Check that not too many tokens are already associated with the user
    const tokenCount = await AccessToken.countDocuments({ userId: user._id });
    if (tokenCount >= 5) {
        // Delete the oldest token
        await AccessToken.deleteOne({ userId: user._id }, { sort: { createdAt: 1 } });
    }

    // Save the access token
    await accessToken.save();

    // Return the generated token
    return token;
}

function generateDefaultQuotaObject() {
    return {
        dailyQuotaUsed: 0,
        dailyQuotaMax: 500,
        dailyQuotaReset: Date.now() + 1000 * 60 * 60 * 24,
        weeklyQuotaUsed: 0,
        weeklyQuotaMax: 5000,
        weeklyQuotaReset: Date.now() + 1000 * 60 * 60 * 24 * 7,
        monthlyQuotaUsed: 0,
        monthlyQuotaMax: 50000,
        monthlyQuotaReset: Date.now() + 1000 * 60 * 60 * 24 * 30,
    }
}