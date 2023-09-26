const Squeal = require('../models/squealModel');

// Get all squeals
exports.getAllSqueals = async (req, res, next) => {
    try {

        // Get all squeals from the database
        const squeals = await Squeal.find();

        // Send the squeals as the response
        res.status(200).json(squeals);
    } catch (error) {
        next(error);
    }
};

// Create a new squeal
exports.createSqueal = async (req, res, next) => {

    try {

        // Get the squeal data from the request body
        const squealData = req.body;

        // Create a new squeal
        const squeal = new Squeal(squealData);

        // Save the squeal
        await squeal.save();

        // Send the squeal as response
        res.status(201).json(squeal);
    }
    catch (error) {
        next(error);
    }
}

