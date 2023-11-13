
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
            console.log(position);
            points.push({latitude: position.coords.latitude, longitude: position.coords.longitude});
        }, (error) => {
            console.log(error);
        });

        //remove id parameter from lastSentSqueal if exists
        if(lastSentSqueal._id){
            delete lastSentSqueal._id;
        }

        console.log(points);

        // Aggiorna posizione
        let lastSentSquealCopy = Object.assign({}, lastSentSqueal);
        lastSentSquealCopy.mapPoints = points;

        let newPostedSqueal = null;

        postSqueal(lastSentSquealCopy, targetChannels, points).then((response) => {
            if (response.status === 201) {
                newPostedSqueal = response.data;
                console.log(newPostedSqueal);

                // Aggiorna contatore squeal inviati
                squealSentCount++;

                sendLiveLocationSqueal(sendAfterMs, sendForMs - sendAfterMs, newPostedSqueal, squealSentCount + 1, targetChannels);
            }
        });
    }, sendAfterMs);
}

function sendVariablesSqueal(sendAfterMs, sendForMs, varSqueal, squealSentCount, targetChannels, variables) {
    if (sendForMs <= sendAfterMs) {
        return;
    }
    console.log("waiting " + sendAfterMs + "ms to send squeal " + squealSentCount + "...");
    setTimeout(() => {

        //remove id parameter from lastSentSqueal if exists
        if(varSqueal._id){
            delete varSqueal._id;
        }

        let content = varSqueal.content;

        //iterate over variables
        for (let i = 0; i < variables.length; i++) {
            let replacement = "";

            switch (variables[i].type) {
                case "date":
                    replacement = new Date().toLocaleDateString();
                    break;
                case "time":
                    replacement = new Date().toLocaleTimeString();
                    break;
                case "number":
                    replacement = squealSentCount;
            }

            //replace all variables with their value
            content = content.replace(variables[i].name, replacement);
        }

        // Copy lastSentSqueal
        let lastSentSquealCopy = Object.assign({}, varSqueal);
        // Update content
        lastSentSquealCopy.content = content;

        postSqueal(lastSentSquealCopy, targetChannels).then((response) => {
            if (response.status === 201) {
                let newPostedSqueal = response.data;
                console.log(newPostedSqueal);
                sendVariablesSqueal(sendAfterMs, sendForMs - sendAfterMs, varSqueal, squealSentCount + 1, targetChannels, variables);
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