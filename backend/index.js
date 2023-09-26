const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const passport = require('passport');
const errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware");
const seeder = require('./database/seeder');


// Connect to MongoDB
const mongoURL = "mongodb://admin:password@mongodb:27017/squealer";//'mongodb://mongodb:27017/squealer?directConnection=true&serverSelectionTimeoutMS=2000';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Middleware setup
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));

// Define API routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Define static routes
const staticRoutes = require('./routes/staticRoutes');
const {setUpPassport} = require("./config/passport");
const path = require("path");
app.use('/static', staticRoutes);

//Configure passport to use bearer tokens
setUpPassport(passport);


// Serve the React client app
let appBuildPath = path.join(__dirname, '../frontend/app/build');
app.use(express.static(appBuildPath));
app.get('/app', (req, res) => {
    res.sendFile(path.join(appBuildPath, 'index.html'));
});

// Serve the SMM app
let smmBuildPath = path.join(__dirname, '../frontend/smm/build');
app.use(express.static(smmBuildPath));
app.get('/smm', (req, res) => {
    res.sendFile(path.join(smmBuildPath, 'index.html'));
});

// Use the error handling middleware as the last middleware
app.use(errorHandlingMiddleware);

// Seed db
seeder.seed();

// Start the server
app.listen(port, () => {
    console.log(`Server is running`);
});

// Export the 'app' instance
module.exports = app;