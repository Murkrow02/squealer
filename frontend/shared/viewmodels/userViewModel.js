function getProfile() {
    return api.get("users/profile");
}

function searchByUsername(username) {
    return api.get("users/searchByUsername/" + username);
}

function setSmm(smmId) {
    return api.patch("users/setSmm/" + smmId);
}