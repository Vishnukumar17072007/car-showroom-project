import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import {apiGet, apiPost} from "../../api/axios";
import toast from "react-hot-toast";

function persistUserRole(user) {
    try {
        if (user?.role) {
            localStorage.setItem("userRole", user.role);
        } else {
            localStorage.removeItem("userRole");
        }
    } catch {
        // ignore storage errors
    }
}

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
                await checkUser();
            } catch {
                setUser(null);
                persistUserRole(null);
            } finally {
                setAuthLoading(false);
            }
        }

        restoreSession();

    }, []);

    /* ─── Registration OTP: sent to the email BEFORE any account exists.
       "Generate OTP" in the signup form calls this. ─── */
    async function sendRegistrationOtp(email) {
        const res = await apiPost('/auth/send-registration-otp', { email });
        toast.success("OTP sent to your email.");

        return res;
    }

    /* ─── Register: single step. otp is submitted along with the rest of the
       form — the account is only created if it's correct, and the response
       logs the user straight in (same shape as login). ─── */
    async function register(userName, email, password, phone, otp) {
        const res = await apiPost('/auth/register', { userName, email, password, phone, otp });
        const user = await checkUser();

        localStorage.setItem("token", res.token);

        toast.success("Welcome! How can we help you?");

        return user;
    }

    async function login(email, password) {
        const res = await apiPost('/auth/login', { email, password });
        const user = await checkUser();

        localStorage.setItem("token", res.token);

        toast.success("Welcome back! How can we help you?");

        return user;
    }

    async function logout() {
        await apiPost('/auth/logout');
        setUser(null);
        localStorage.removeItem("token");
        persistUserRole(null);
    }

    async function checkUser() {
        const res = await apiGet('/profile/me');
        setUser(res);
        persistUserRole(res);
    }

    /* ─── Forgot password (OTP flow) ─────────────────────────────── */

    async function requestPasswordOtp(email) {
        const res = await apiPost('/auth/forgot-password', { email });
        toast.success("If that email exists, a code has been sented to your email.");

        return res;
    }

    async function verifyPasswordOtp(email, otp) {
        const res = await apiPost('/auth/verify-otp', { email, otp });

        return res;
    }

    async function resetPassword(email, token, newPassword) {
        const res = await apiPost('/auth/reset-password', { email, token, newPassword });
        toast.success("Password updated. You can sign in now.");

        return res;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                register,
                login,
                logout,
                checkUser,
                authLoading,
                requestPasswordOtp,
                verifyPasswordOtp,
                resetPassword,
                sendRegistrationOtp,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}