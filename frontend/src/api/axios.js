import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function apiGet(path) {
    const res = await API.get(path);
    return res.data;
}

export async function apiPost(path, body) {
    const res = await API.post(path, body);
    return res.data;
}

export async function apiPut(path, body) {
    const res = await API.put(path, body);
    return res.data;
}

export async function apiPatch(path, body) {
    const res = await API.patch(path, body);
    return res.data;
}

export async function apiDelete(path) {
    const res = await API.delete(path);
    return res.data;
}

export default API;