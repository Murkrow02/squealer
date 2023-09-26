const Squeal = require('../../models/squealModel');

function seed(){
    Squeal.insertMany(squealData)
        .then(() => {
            console.log('Squeal data seeded successfully');
        })
        .catch((err) => {
            console.error('Error seeding squeal data:', err);
        });
}

const squealData = [
    { text: 'Squeal 1', author: 'user1' },
    { text: 'Squeal 2', author: 'user2' },
];

module.exports = { seed };