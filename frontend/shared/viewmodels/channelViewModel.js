
//Note: this is used only for debug purposes
function searchChannels(type, query) {
    return api.get("channels/" + type + "?search=" + query);
}