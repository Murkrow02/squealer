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

function searchByUsername(username, type = null) {
    return api.get("users/searchByUsername?search=" + username + (type ? "&type=" + type : ""));
}

function setSmm(smmId) {
    return api.patch("users/setSmm/" + smmId);
}

function removeSmm() {
    return api.patch("users/removeSmm");
}

function changePassword(oldPassword, newPassword) {
    return api.patch("users/profile/changePassword", { oldPassword, newPassword });
}

function getAllUsers() {
    return api.get("users");
}

function deleteAccount() {
    return api.delete("users/profile");
}

function goPro() {
    return api.patch("users/gopro");
}

// Only smm
function updateUser(id, type, dailyQuotaMax, dailyQuotaUsed, weeklyQuotaMax, weeklyQuotaUsed, monthlyQuotaMax, monthlyQuotaUsed) {

    let user = {
        type,
        quota: {
            dailyQuotaMax,
            dailyQuotaUsed,
            weeklyQuotaMax,
            weeklyQuotaUsed,
            monthlyQuotaMax,
            monthlyQuotaUsed
        }
    }

    return api.patch("users/" + id, user);
}