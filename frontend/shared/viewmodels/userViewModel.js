function register(username, password, email) {
    return api.post(`auth/register/false`, {username, password, email})
        .then(response => {

            //Save token in local storage
            localStorage.setItem('token', response.data.token);

            //Redirect to url provided by backend after successful login
            window.location.href = response.data.redirectURL;
        });
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