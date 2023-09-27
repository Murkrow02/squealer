
//Note: this is used only for debug purposes
function getAllSqueals(){
    return api.get("squeals");
}

function postSqueal(squeal, channels){

    //Create mixed object
    let post = {
        squeal: squeal,
        channels: channels
    }

    return api.post("squeals", post);
}