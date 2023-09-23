const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const User = require("./models/user");


// Connect to MongoDB
const mongoURL = `mongodb://mongodb:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6/squealer`;
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

app.get('/api/a', (req, res) => {
    const User = require('./models/user'); // Import your model

    const newUser = new User({
        username: 'john_doe',
        email: 'john@example.com',
        age: 30,
    });

    newUser.save((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('User saved successfully!');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running`);
});

