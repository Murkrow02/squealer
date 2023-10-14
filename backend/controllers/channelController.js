// userController.js
const Channel = require('../models/channelModel');
const User = require('../models/userModel');

exports.subscribeToChannel = async (req, res, next) => {

    try {
        // Get logged user
        let user = await User.findById(req.user.id).select("+subscribedChannels");

        // Get channel to subscribe to
        let channel = await Channel.findById(req.params.channelId);

        // Check if channel exists
        if (!channel) {
            return res.status(404).json({error: "Il canale non é stato trovato"});
        }

        // Check if user is already subscribed to the channel
        if (!user.subscribedChannels.includes(channel._id)) {

            // Actually subscribe the user to the channel
            user.subscribedChannels.push(channel._id);
        }

        // Save the user
        await user.save();

        // OK
        res.status(200).json({success: `Iscrizione a ${channel.name} avvenuta con successo`});
    } catch (error) {
        next(error);
    }
}

exports.unsubscribeFromChannel = async (req, res, next) => {

    try {
        // Get logged user
        let user = await User.findById(req.user.id).select("+subscribedChannels");

        // Get channel to unsubscribe from
        let channel = await Channel.findById(req.params.channelId);

        // Check if channel exists
        if (!channel) {
            return res.status(404).json({error: "Il canale non é stato trovato"});
        }

        // Check if user is actually subscribed to the channel
        if (user.subscribedChannels.includes(channel._id)) {

            // Actually unsubscribe the user from the channel
            user.subscribedChannels.splice(user.subscribedChannels.indexOf(channel._id), 1);
            await user.save();

            // OK
            return res.status(200).json({success: `Disiscrizione da ${channel.name} avvenuta con successo`});
        } else {
            return res.status(404).json({error: "Non sei iscritto a questo canale"});
        }
    } catch (error) {
        next(error);
    }
}

// DEBUG ONLY
exports.getAllChannels = async (req, res, next) => {

    try {

        // Get all channels from the database
        const channels = await Channel.find();

        // Send the channels as the response
        res.status(200).json(channels);

    } catch (error) {
        next(error);
    }
}

exports.getChannelsByCategory = async (req, res, next) => {

    // Get the category from the request
    const category = req.params.channelCategory;

    // Get search parameters from the request
    const search = req.query.search;

    // Abort if private category is requested
    if (category === "private") {
        return res.status(403).json({error: "Non puoi cercare canali privati"});
    }

    try {

        // If search param is present, search for channels by name
        if (search) {

            // Search for channels by name (if search param is present)
            const query = {};
            if (search && search !== "" && search !== "undefined")
                query.name = { $regex: search, $options: "i" };
            if (category)
                query.category = category;
            const channels = await Channel.find(query);


            // Send the channels as the response
            return res.status(200).json(channels);
        }

        // Get all channels from the database with the specified category
        const channels = await Channel.find({category: category});

        // Send the channels as the response
        res.status(200).json(channels);

    } catch (error) {
        next(error);
    }
}

exports.createChannel = async (req, res, next) => {

    // Get the channel name from the request
    var name = req.body.name;

    // Check if contains illegal characters (any character that is not a letter, a number or an underscore)
    if (name.match(/[^a-zA-Z0-9_]/)) {
        return res.status(400).json({error: "Il nome del canale può contenere solo lettere, numeri e underscore"});
    }

    // Add the symbol to the channel name
    name ='§' + name.toLowerCase();

    // Check if channel with the same name already exists
    let conflict = await Channel.where('name').equals(name).exec();

    // If channel with the same name already exists, abort
    if (conflict.length > 0) {
        return res.status(409).json({error: "Un canale con questo nome esiste già"});
    }

    // The channel category is always public
    const category = "public";

    // Get the channel description from the request
    const description = req.body.description;

    // Add logged user as admin
    const admins = [req.user.id];

    // Create the channel
    const channel = new Channel({
        name: name,
        category: category,
        description: description,
        admins: admins,
    });

    try {
        // Save the channel
        let newChannel = await channel.save();

        // Add the channel to the logged user's createdChannels and subscribedChannels
        let user = await User.findById(req.user.id)
            .select("+createdChannels +subscribedChannels")
            .populate('createdChannels','subscribedChannels');
        user.subscribedChannels.push(newChannel._id);
        user.createdChannels.push(newChannel._id);
        await user.save();

        // Return the channel as the response
        res.status(201).json(newChannel);

    }catch (error) {
        next(error);
    }
}
