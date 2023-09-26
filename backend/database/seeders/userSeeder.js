import User from '../../models/userModel.js';

function seed(){
    User.insertMany(usersData)
        .then(() => {
            console.log('Data inserted successfully');
        })
        .catch((err) => {
            console.error('Error inserting data:', err);
        });
}

const usersData = [
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
];

export default { seed };