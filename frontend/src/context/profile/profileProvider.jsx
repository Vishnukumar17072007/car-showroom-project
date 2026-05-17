import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import ProfileContext from "./profileContext";

function ProfileProvider({ children }) {

    const { checkAuth } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");
    const [success, setSuccess] = useState("");

    // ── Clear messages (call this when the form mounts or resets) ──
    function clearMessages() {
        setError("");
        setSuccess("");
    }

    // ── Main update function ──────────────────────────────────────
    // Accepts: { userName, phone, currentPassword?, newPassword? }
    // Returns: true if successful, false if failed
    async function updateProfile(data) {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.message || "Update failed. Please try again.");
                return false;
            }

            // Refresh the user object in AuthContext
            await checkAuth();

            setSuccess("Profile updated successfully!");
            return true;

        } catch {
            setError("Something went wrong. Please check your connection.");
            return false;

        } finally {
            setLoading(false);
        }
    }

    const value = {
        loading,
        error,
        success,
        clearMessages,
        updateProfile,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;