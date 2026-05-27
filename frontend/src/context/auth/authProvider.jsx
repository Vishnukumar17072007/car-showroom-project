import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import API from "../../api/axios";
import toast from "react-hot-toast";

export function AuthProvider({children}){


    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        async function restoreSession() {
            try {
                const res = await API.get('/auth/me');
                setUser(res.data);
            }
            catch(err) {
                if (err.response?.status === 401) {
                    // Expected — no cookie, user is a guest
                    setUser(null);
                } else {
                    setUser(null);
                }
            }
            finally{
                setAuthLoading(false);
            }
        }
        restoreSession();
    },[])

    async function register(userName, email, password, phone) {
        await API.post('/auth/register', {
            userName,
            email,
            password,
            phone
        });
    
        await API.post('/auth/login', {
            email,
            password
        });
    
        const profile = await API.get('/auth/me');
    
        setUser(profile.data);
    
        toast.success("Welcome! How can we help you?");
        return profile.data;
    }
    
    async function login(email, password) {
    
        await API.post('/auth/login', {
            email,
            password
        });
    
        const profile = await API.get('/auth/me');
    
        setUser(profile.data);
    
        toast.success("Welcome back! How can we help you?");
        return profile.data;
    }

    async function logout(){
        await API.post('/auth/logout');
        setUser(null);
    }

    async function checkAuth() {
        const res = await API.get('/auth/me');
        setUser(res.data);
    }

    return(
        <AuthContext.Provider value={{user, register, login, logout, checkAuth, authLoading}}>
            {children}
        </AuthContext.Provider>
    );
}