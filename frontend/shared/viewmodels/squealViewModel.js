
// Moderator only
function getAllSqueals(){
    return api.get("squeals/all");
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
    //squeal["mapPoints"] = mapPoints;

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


function sendLiveLocationSqueal(sendAfterMs, sendForMs, lastSentSqueal, squealSentCount, targetChannels) {
    if (sendForMs <= sendAfterMs) {
        return;
    }
    console.log("waiting " + sendAfterMs + "ms to send squeal " + squealSentCount + "...");
    setTimeout(() => {

        let position = lastSentSqueal.mapPoints;


        // Crea array punti posizione
        let points = position ? position : [];

        //get user current position
        navigator.geolocation.getCurrentPosition((position) => {
            points.push({latitude: position.coords.latitude, longitude: position.coords.longitude});
        }, (error) => {
            console.log(error);
            return
        });

        // Aggiungi nuovo punto posizione
        //points.push({latitude: 0, longitude: 0});

        //remove id parameter from lastSentSqueal if exists
        if(lastSentSqueal._id){
            delete lastSentSqueal._id;
        }

        console.log(points);

        // Aggiorna posizione
        let lastSentSquealCopy = Object.assign({}, lastSentSqueal);
        lastSentSquealCopy.mapPoints = points;

        let newPostedSqueal = null;

        postSqueal(lastSentSqueal, targetChannels, points).then((response) => {
            if (response.status === 201) {
                newPostedSqueal = response.data;
                console.log(newPostedSqueal);

                // Aggiorna contatore squeal inviati
                squealSentCount++;

                sendLiveLocationSqueal(sendAfterMs, sendForMs - sendAfterMs, newPostedSqueal, squealSentCount, targetChannels);
            }
        });
    }, sendAfterMs);
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