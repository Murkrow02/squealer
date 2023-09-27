//This file needs to be imported before all other view models
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');