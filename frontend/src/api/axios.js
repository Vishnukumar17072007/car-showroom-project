import axios from 'axios';

const API = axios.create({
    baseURL: 'https://car-showroom-project.onrender.com/api',
    withCredentials: true
});

export default API;