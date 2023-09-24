const User = require('../models/userModel');
const AccessToken = require('../models/accessTokenModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Login
exports.login = async (req, res) => {

    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

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

    // Create a token for the user
    createTokenForUser(user).then((token) => {
        return res.json({ token: token });
    }).catch((error) => {
        return res.status(500).json({ error: 'Errore durante la creazione del token', log: error });
    });
};

// Register
exports.register = async (req, res) => {

    // Get the username and password from the request body
    const { username, password } = req.body;

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
        username,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.json({ message: 'Registrazione avvenuta con successo' });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante la registrazione', log: error });
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