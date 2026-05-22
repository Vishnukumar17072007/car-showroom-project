import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import ProfileContext from "./profileContext";
import API from "../../api/axios";

function ProfileProvider({ children }) {
    const { checkAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function clearMessages() {
        setError("");
        setSuccess("");
    }

    async function updateProfile(data) {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await API.put('/auth/update', data);

            try {
                await checkAuth();
            } catch {
                // profile saved even if session refresh fails
            }

            setSuccess(res.data?.message || "Profile updated successfully!");
            return true;
        } catch (err) {
            setError(err.response?.data?.message || "Update failed. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    }

    return (
        <ProfileContext.Provider value={{ loading, error, success, clearMessages, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;
