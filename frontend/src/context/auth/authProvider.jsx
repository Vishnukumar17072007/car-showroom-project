import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import API from "../../api/axios";
import toast from "react-hot-toast";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        // Check if URL has ?token= from Google OAuth redirect
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");

        if (urlToken) {
            localStorage.setItem("token", urlToken);
            // Clean token from URL without triggering navigation
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        async function restoreSession() {
            try {
                const res = await API.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        }

        restoreSession();
    }, []);

    async function register(userName, email, password, phone) {
        await API.post('/auth/register', { userName, email, password, phone });
        await API.post('/auth/login', { email, password });
        const profile = await API.get('/auth/me');
        setUser(profile.data);
        toast.success("Welcome! How can we help you?");
        return profile.data;
    }

    async function login(email, password) {
        await API.post('/auth/login', { email, password });
        const profile = await API.get('/auth/me');
        setUser(profile.data);
        toast.success("Welcome back! How can we help you?");
        return profile.data;
    }

    async function logout() {
        await API.post('/auth/logout');
        setUser(null);
        localStorage.removeItem("token");  // ← clear token on logout
    }

    async function checkAuth() {
        const res = await API.get('/auth/me');
        setUser(res.data);
    }

    return (
        <AuthContext.Provider value={{ user, register, login, logout, checkAuth, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
}