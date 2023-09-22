const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');


// Connect to MongoDB
const username = 'site222332';
const password = 'cur3Ail5';
const host = 'mongodb';
const databaseName = 'squealer';
const mongoURL = `mongodb://${username}:${password}@${host}:27017/${databaseName}`;
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB ZZ:', error);
    });

// Serve the static React build files
let appBuildPath = path.join(__dirname, '../frontend/app/build');
app.use(express.static(appBuildPath));

// Serve the static alpine build files
let smmBuildPath = path.join(__dirname, '../frontend/smm/build');
app.use(express.static(smmBuildPath));

// Handle requests by serving the React app
app.get('/', (req, res) => {
    res.sendFile(path.join(appBuildPath, 'index.html'));
});

// Handle requests by serving the React app
app.get('/smm', (req, res) => {
    res.sendFile(path.join(smmBuildPath, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running`);
});