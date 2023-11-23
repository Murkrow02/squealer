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

// MODERATOR ONLY
exports.getAllChannels = async (req, res, next) => {

    try {

        // Get all channels from the database except private channels
        const channels = await Channel.find(); //{category: {$ne: "private"}}

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
                query.name = {$regex: search, $options: "i"};
            if (category)
                query.category = category;
            const channels = await Channel.find(query);

            // Foreach channel check if user is subscribed and add subscribed field
            for (let i = 0; i < channels.length; i++) {

                // Get user from database
                let user = await User.findById(req.user.id).select("+subscribedChannels");

                // Check if user is subscribed to the channel
                if (user.subscribedChannels.includes(channels[i]._id)) {
                    channels[i] = channels[i].toObject();
                    channels[i]['subscribed'] = true;
                } else {
                    channels[i] = channels[i].toObject();
                    channels[i]['subscribed'] = false;
                }
            }

            // Send the channels as the response
            return res.status(200).json(channels);
        }

        // Get all channels from the database with the specified category, ordered by creation date
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
    if (illegalName(name)) {
        return res.status(400).json({error: "Il nome del canale può contenere solo lettere, numeri e underscore"});
    }

    // Add the symbol to the channel name
    name = '§' + name.toLowerCase();

    // Check if channel with the same name already exists
    let conflict = await Channel.where('name').equals(name).exec();

    // If channel with the same name already exists, abort
    if (conflict.length > 0) {
        return res.status(409).json({error: "Un canale con questo nome esiste già"});
    }

    // Check if user is moderator or normal user
    if (req.user.type === "moderator") {

        // The channel category is editorial when created by a moderator
        var category = "editorial";
        name = name.toUpperCase();
    } else {
        // The channel category is always public when created by a normal user
        var category = "public";
    }

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
            .populate('createdChannels', 'subscribedChannels');
        user.subscribedChannels.push(newChannel._id);
        user.createdChannels.push(newChannel._id);
        await user.save();

        // Return the channel as the response
        res.status(201).json(newChannel);

    } catch (error) {
        next(error);
    }
}

exports.bandUserFromChannel = async (req, res, next) => {

    // Get the channel to ban the user from
    const channel = await Channel.findById(req.params.channelId).select("+banned").select("+admins");

    // Check if channel exists
    if (!channel) {
        return res.status(404).json({error: "Il canale non é stato trovato"});
    }

    // Check if user is admin of the channel
    if (channel.admins == null || !channel.admins.includes(req.user.id)) {
        return res.status(403).json({error: "Non sei amministratore di questo canale"});
    }

    // Get the user to ban from the channel
    const user = await User.findById(req.params.userId);

    // Check if user exists
    if (!user) {
        return res.status(404).json({error: "L'utente non é stato trovato"});
    }

    // Check if user is already banned from the channel
    if (channel.banned.includes(user._id)) {
        return res.status(409).json({error: "L'utente é già stato bannato da questo canale"});
    }

    // Actually ban the user from the channel
    channel.banned.push(user._id);

    // Save the channel
    await channel.save();

    // OK
    res.status(200).json({success: `L'utente ${user.username} é stato bannato dal canale ${channel.name}`});
}

exports.deleteChannel = async (req, res, next) => {

    // Get the channel to delete
    const channel = await Channel.findById(req.params.channelId);

    // Check if channel exists
    if (!channel) {
        return res.status(404).json({error: "Il canale non é stato trovato"});
    }

    // Check if user is admin of the channel (or user is moderator)
    if ((channel.admins == null || !channel.admins.includes(req.user.id)) && req.user.type !== "moderator") {
        return res.status(403).json({error: "Non sei amministratore di questo canale"});
    }

    // Actually delete the channel
    await channel.deleteOne();

    // OK
    res.status(200).json({success: `Il canale ${channel.name} é stato cancellato`});
}

exports.editChannel = async (req, res, next) => {

    // Get the channel to edit
    const channel = await Channel.findById(req.params.channelId);

    // Check if channel exists
    if (!channel) {
        return res.status(404).json({error: "Il canale non é stato trovato"});
    }

    // Check if user is admin of the channel (or user is moderator)
    if ((channel.admins == null || !channel.admins.includes(req.user.id)) && req.user.type !== "moderator") {
        return res.status(403).json({error: "Non sei amministratore di questo canale"});
    }

    // Get the new channel name from the request
    let newName = req.body.name;

    // Check if contains illegal characters (any character that is not a letter, a number or an underscore)
    if (illegalName(newName)) {
        return res.status(400).json({error: "Il nome del canale può contenere solo lettere, numeri e underscore"});
    }

    // Add the symbol to the channel name (if not already present)
    if (newName.charAt(0) !== '§') {
        newName = '§' + newName.toLowerCase();
    }

    // Check if channel with the same name already exists (except the current one)
    let conflict = await Channel.where('name').equals(newName).where('_id').ne(channel._id).exec();

    // If channel with the same name already exists, abort
    if (conflict.length > 0) {
        return res.status(409).json({error: "Un canale con questo nome esiste già"});
    }

    // Get the new channel description from the request
    const newDescription = req.body.description;

    // Actually edit the channel
    channel.name = newName;
    channel.description = newDescription;

    // Save the channel
    await channel.save();

    // OK
    res.status(200).json({success: `Il canale ${channel.name} é stato modificato`});
}

function illegalName(name) {

    // Allow only letters, numbers, and underscores, and § as the first character
    return !name.match(/^(§?[a-zA-Z0-9_]+)$/);
}