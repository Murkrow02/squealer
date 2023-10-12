
//Note: this is used only for debug purposes DO NOT USE
function getAllSqueals(){
    //alert("DEBUG ONLY");
    return api.get("squeals");
}

// Feed for logged user (squeals from subscribed channels)
function getFeed(){
    return api.get("squeals");
}

// Create a new squeal
function postSqueal(squeal, targetChannels, mapPoints = []){

    // Create mapPoints object
    // This has the following format:
    // [{
    //     "lat": 0,
    //     "lng": 0,
    // }, ...]
    squeal["mapPoints"] = mapPoints;

    //Create mixed object
    let post = {
        squeal: squeal,
        channels: targetChannels
    }

    return api.post("squeals", post);
}

// Add media to a squeal
function postMediaToSqueal(squealId, media){

    // Create form data
    let formData = new FormData();
    formData.append("media", media);

    return api.post("squeals/" + squealId + "/media", formData);
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