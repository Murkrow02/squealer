
//Note: this is used only for debug purposes DO NOT USE
function getAllSqueals(){
    alert("DEBUG ONLY");
    return api.get("squeals");
}

// Feed for logged user (squeals from subscribed channels)
function getFeed(){
    return api.get("squeals");
}

// Create a new squeal
function postSqueal(squeal, targetChannels){

    //Create mixed object
    let post = {
        squeal: squeal,
        channels: targetChannels
    }

    return api.post("squeals", post);
}

// Get feed only of a specific channel
function searchByChannelId(channelId){
    return api.get("squeals/searchByChannelId/" + channelId);
}

// Get all possible reactions for a squeal
function getAllReactions(){
    return api.get("squeals/allReactions");
}

// React to a squeal
function reactToSqueal(squealId, reactionId){
    return api.patch("squeals/" + squealId + "/react/" + reactionId);
}

// Unreact to a squeal
function unreactToSqueal(squealId, reactionId){
    return api.patch("squeals/" + squealId + "/unreact/" + reactionId);
}

// Add an impression to a squeal (should be called every time a squeal is viewed)
function addImpression(squealId){
    return api.patch("squeals/" + squealId + "/impression");
}