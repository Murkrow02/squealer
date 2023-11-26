function getSmmFeed() {
    return api.get("smm/feed");
}

function getReplies(squealId) {
    return api.get("smm/" + squealId + "/replies");
}