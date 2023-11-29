const User = require('../../models/userModel');

async function seed(){

    // Delete all users
    await User.deleteMany({});

    // Create test users
    let usersData = [];
    for (let i = 0; i < usersData.length; i++) {

    }

    // Insert users
    return User.insertMany(usersData);
}

const usersData = [
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
];

module.exports = { seed };