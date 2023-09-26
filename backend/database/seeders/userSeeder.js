const User = require('../../models/userModel');

async function seed(){

    // Delete all users
    await User.deleteMany({});

    // Insert users
    return User.insertMany(usersData);
}

const usersData = [
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
];

module.exports = { seed };