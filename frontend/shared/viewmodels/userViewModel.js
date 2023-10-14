function register(username, password, email) {
    return api.post("auth/register", { username, password, email });
}

function getProfile() {
    return api.get("users/profile");
}

function searchByUsername(username) {
    return api.get("users/searchByUsername/" + username);
}

function setSmm(smmId) {
    return api.patch("users/setSmm/" + smmId);
}

function changePassword(oldPassword, newPassword) {
    return api.patch("users/profile/changePassword", { oldPassword, newPassword });
}