import API from './axios';

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
