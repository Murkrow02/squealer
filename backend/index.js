const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy: BearerStrategy } = require('passport-http-bearer');
const AccessToken = require('./models/accessTokenModel');
const User = require('./models/userModel');

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

// Handle requests to serve the client app
app.get('/', (req, res) => {
    res.sendFile(path.join(appBuildPath, 'index.html'));
});

// Handle requests by serving the smm app
app.get('/smm', (req, res) => {
    res.sendFile(path.join(smmBuildPath, 'index.html'));
});

// Middleware setup
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));

//Passport setup
passport.use(new BearerStrategy(
    (token, done) => {

        //Find the requested token
        AccessToken.findOne({token: token}).then((accessToken) => {

            //If the token doesn't exist
            if (!accessToken) {
                return done(null, false);
            }

            console.log(accessToken.userId);

            //Find the user associated with the token
            User.findById(accessToken.userId).then((user) => {

                //If the user doesn't exist
                if (!user) {
                    return done(null, false);
                }

                //If the user exists
                return done(null, user, { scope: 'all' });
            });


        }).catch((error) => {
            return done(error);
        });
    }
));

// Serialize and deserialize user (optional, but required for session support)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
        return done(new Error('User not found'));
    }
    done(null, user);
});

// Define routes
const apiRoutes = require('./apiRoutes');
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running`);
});