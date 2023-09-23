const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const User = require("./models/user");


// Connect to MongoDB
const mongoURL = "mongodb://admin:password@mongodb:27017/squealer";//'mongodb://mongodb:27017/squealer?directConnection=true&serverSelectionTimeoutMS=2000';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
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

app.get('/api/a', async (req, res) => {
    const User = require('./models/user'); // Import your model

    const newUser = new User({
        username: 'john_doe',
        email: 'john@example.com',
        age: 30,
    });

    try {
        await newUser.save();
        console.log('User saved successfully!');
        res.status(200).send('User saved successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving user.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running`);
});

