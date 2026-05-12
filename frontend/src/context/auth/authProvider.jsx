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
                    console.log("Unexpected auth error:", err.message);
                    setUser(null);
                }
            }
            finally{
                setAuthLoading(false);
            }
        }
        restoreSession();
    },[])

    async function register(userName, email, password, role){
        const res = await API.post('/auth/register', {userName, email, password, role});
        toast.success("Welcome🙏 how can we help you!?");
        return res.data;
    }

    async function login(email, password) {
        const res = await API.post('/auth/login', {email, password});
        setUser(res.data.user);
        toast.success("Welcome again🙏 how can we help you!?");
        return res.data;
    }

    async function logout(){
        await API.post('/auth/logout');
        toast.success("Bye👋.");
        setUser(null);
    }

    return(
        <AuthContext.Provider value={{user, register, login, logout, authLoading}}>
            {children}
        </AuthContext.Provider>
    );
}