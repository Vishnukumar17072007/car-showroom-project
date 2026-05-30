import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { useProfile } from "../context/profile/useProfile";

function EditProfile() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const { loading, error, success, clearMessages, updateProfile } = useProfile();

    // Local form state only — no API logic here
    const email = String(user?.email);
    const googleId = String(user?.googleId);
    const [userName, setUserName] = useState(String(user?.userName          || ""));
    const [phone,    setPhone]    = useState(String(user?.phone             || ""));
    const [address,  setAddress]  = useState(String(user?.location?.address || ""));
    const [city,     setCity]     = useState(String(user?.location?.city    || ""));
    const [state,    setState]    = useState(String(user?.location?.state   || ""));
    const [pincode,  setPincode]  = useState(String(user?.location?.pincode || ""));


    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [currentPassword,    setCurrentPassword]    = useState("");
    const [newPassword,        setNewPassword]        = useState("");
    const [confirmPassword,    setConfirmPassword]    = useState("");

    // Clear any leftover messages when this page first loads
    useEffect(() => {
        clearMessages();
    }, []);

    // Navigate back after success message shows
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => navigate("/profile"), 1500);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // ── Validation (stays in page — it's UI logic, not DB logic) ──
    function validate() {
        if (!String(userName).trim()) return { ok: false, msg: "Username cannot be empty." };
        if (!String(phone).trim())    return { ok: false, msg: "Phone cannot be empty." };
        if (!String(address).trim())    return { ok: false, msg: "address cannot be empty." };
        if (!String(city).trim())    return { ok: false, msg: "city cannot be empty." };
        if (!String(state).trim())    return { ok: false, msg: "state cannot be empty." };
        if (!String(pincode).trim())    return { ok: false, msg: "pincode cannot be empty." };
        if(user.email){
            if (showPasswordFields) {
                if (!currentPassword)          return { ok: false, msg: "Please enter your current password." };
                if (newPassword.length < 8)    return { ok: false, msg: "New password must be at least 8 characters." };
                if (newPassword !== confirmPassword) return { ok: false, msg: "New passwords do not match." };
            }
        }
        return { ok: true };
    }

    // ── Save handler — builds data object, delegates to context ──
    async function handleSave() {
        const check = validate();
        if (!check.ok) {
            // show local validation error — no need to go to context for this
            alert(check.msg); // replace with your toast if preferred
            return;
        }

        const data = { email, googleId, userName, phone, address, city, state, pincode };
        if (showPasswordFields) {
            data.currentPassword = currentPassword;
            data.newPassword     = newPassword;
        }

        await updateProfile(data);
    }

    return (
        <div className="edit-profile-scroll-area">
            <div className="edit-profile">
                {/* ── Back Button + Title ── */}
                <div className="ep-header">
                    <button className="ep-back-btn" onClick={() => navigate("/profile")}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <div>
                        <h2 className="ep-title">Edit Profile</h2>
                        <p className="ep-subtitle">Update your account details</p>
                    </div>
                </div>

                {/* ── Avatar ── */}
                <div className="ep-avatar-section">
                    <div className="ep-avatar-circle">
                        {user?.image
                            ? <img src={user.image} alt="Profile" className="ep-avatar-img" />
                            : <span>{user?.userName?.charAt(0).toUpperCase()}</span>
                        }
                        <div className="ep-avatar-overlay">
                            <i className="bi bi-camera"></i>
                        </div>
                    </div>
                    <p className="ep-avatar-hint">Tap to change photo</p>
                </div>

                {/* ── Feedback Messages — driven by context state ── */}
                {error   && <p className="ep-msg ep-error">  <i className="bi bi-exclamation-circle"></i> {error}   </p>}
                {success && <p className="ep-msg ep-success"> <i className="bi bi-check-circle"></i>       {success} </p>}

                {/* ── Personal Info ── */}
                <div className="ep-form-grid">
                    <div className="ep-card">
                        <p className="ep-section-label">Personal information</p>

                        <div className="ep-field">
                            <label className="ep-label">
                                <i className="bi bi-person"></i> Username
                            </label>
                            <input
                                className="ep-input"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="ep-field">
                            <label className="ep-label">
                                <i className="bi bi-envelope"></i> Email
                            </label>
                            <div className="ep-input-wrap">
                                <input
                                    className="ep-input ep-input-disabled"
                                    type="email"
                                    value={user?.email || user?.googleId || ""}
                                    disabled
                                />
                                <i className="bi bi-lock ep-lock-icon"></i>
                            </div>
                            <p className="ep-hint">Email cannot be changed.</p>
                        </div>

                        <div className="ep-field">
                            <label className="ep-label">
                                <i className="bi bi-telephone"></i> Phone
                            </label>
                            <input
                                className="ep-input"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="ep-field">
                            <label className="ep-label">
                                <i className="bi bi-geo-alt"></i> Address
                            </label>
                            <div className="ep-modalContainer">
                                <div className="ep-field">
                                    <label className="ep-label">
                                         Address
                                    </label>
                                    <input
                                        className="ep-input"
                                        type="textarea"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your address"
                                    />
                                </div>
                                <div className="ep-field">
                                    <label className="ep-label">
                                         City
                                    </label>
                                    <input
                                        className="ep-input"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Enter your city"
                                    />
                                </div>
                                <div className="ep-field">
                                    <label className="ep-label">
                                         State
                                    </label>
                                    <input
                                        className="ep-input"
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="Enter your state"
                                    />
                                </div>
                                <div className="ep-field">
                                    <label className="ep-label">
                                         Pincode
                                    </label>
                                    <input
                                        className="ep-input"
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        placeholder="Enter your pincode"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ── Security ── */}
                    {user.email && (
                        <div className={user.email ? "ep-card" : ""}>
                            <p className="ep-section-label">Security</p>

                            <div className="ep-field" style={{ marginBottom: 0 }}>
                                <label className="ep-label">
                                    <i className="bi bi-lock"></i> Password
                                </label>
                                <input
                                    className="ep-input ep-input-disabled"
                                    type="password"
                                    value="placeholder"
                                    disabled
                                />
                            </div>

                            <button
                                className="ep-toggle-pw"
                                onClick={() => {
                                    setShowPasswordFields(!showPasswordFields);
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                }}
                            >
                                <i className={`bi ${showPasswordFields ? "bi-x-lg" : "bi-key"}`}></i>
                                {showPasswordFields ? " Cancel password change" : " Change password"}
                            </button>

                            {showPasswordFields && (
                                <div className="ep-pw-fields">
                                    <div className="ep-field">
                                        <label className="ep-label">
                                            <i className="bi bi-lock"></i> Current password
                                        </label>
                                        <input
                                            className="ep-input"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="ep-field">
                                        <label className="ep-label">
                                            <i className="bi bi-lock-open"></i> New password
                                        </label>
                                        <input
                                            className="ep-input"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                        />
                                    </div>
                                    <div className="ep-field" style={{ marginBottom: 0 }}>
                                        <label className="ep-label">
                                            <i className="bi bi-lock-open"></i> Confirm password
                                        </label>
                                        <input
                                            className="ep-input"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat new password"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* ── Action Buttons ── */}
                <div className="ep-actions">
                    <button className="ep-cancel-btn" onClick={() => navigate("/profile")}>
                        Cancel
                    </button>
                    <button className="ep-save-btn" onClick={handleSave} disabled={loading}>
                        {loading
                            ? <><i className="bi bi-arrow-repeat ep-spin"></i> Saving...</>
                            : <><i className="bi bi-check-lg"></i> Save changes</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;