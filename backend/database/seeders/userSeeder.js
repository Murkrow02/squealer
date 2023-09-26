const User = require('../../models/userModel');

function seed(){
    User.insertMany(usersData)
        .then(() => {
            console.log('User data seeded successfully');
        })
        .catch((err) => {
            console.error('Error seeding user data:', err);
        });
}

const usersData = [
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
];

module.exports = { seed };