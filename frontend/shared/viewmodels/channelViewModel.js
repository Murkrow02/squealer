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

