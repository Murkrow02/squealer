const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

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
    console.log(`Server is running on port ${port}`);
});