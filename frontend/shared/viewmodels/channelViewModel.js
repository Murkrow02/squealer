// Subscribe logged user to a channel
function subscribeToChannel(channelId) {
    return api.patch("channels/" + channelId + "/subscribe");
}

// Unsubscribe logged user from a channel
function unsubscribeFromChannel(channelId) {
    return api.patch("channels/" + channelId + "/unsubscribe");
}

// Search for channel by providing its category (public, editorial...)
// e.g. getChannelsByCategory("editorial", "maiz")
function getChannelsByCategory(category, query) {
    return api.get("channels/" + category + "?search=" + query);
}

// Create new public channel
function createChannel(channelName, channelDescription) {
    return api.post("channels", {
        name: channelName,
        description: channelDescription,
    });
}

// Ban user from channel
function banUserFromChannel(channelId, userId) {
    return api.patch("channels/" + channelId + "/ban/" + userId);
}

// Delete channel
function deleteChannelById(channelId) {
    return api.delete("channels/" + channelId);
}

// Edit channel
function editChannelById(channelId, channelName, channelDescription) {
    return api.put("channels/" + channelId, {
        name: channelName,
        description: channelDescription,
    });
}

// Get all channels (Moderator only)
function getAllChannels() {
    return api.get("channels");
}