let api = axios.create({
    baseURL: '/api',
    timeout: 1000,
    headers: {'Authorization': "Bearer " + localStorage.getItem('token')}
});

// This is triggered on each response, if unauthorized redirect to login
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.log(error);

        if (error && error.response && error.response.data) {
            if (error.response.data.error !== undefined) {
                alert(error.response.data.error);
            } else if (error.response.status === 401) {
                alert("Non sei autorizzato ad accedere a questa pagina, verrai reindirizzato alla pagina di login");
                window.location.href = '/static/auth';
            }
            return error.response;
        }

        return error;
    });