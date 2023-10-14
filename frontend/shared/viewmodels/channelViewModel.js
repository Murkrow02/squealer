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