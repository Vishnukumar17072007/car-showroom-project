import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth/useAuth";
import { useSearch } from "../context/search/useSearch";
import { useNotification } from "../context/notification/useNotification";
import { useTheme } from "../context/theme/useTheme";

function TopHeader() {

    const navigate = useNavigate();
    const location = useLocation();

    const { unreadCount } = useNotification();
    const { isDark, toggleTheme } = useTheme();
    const {user, logout} = useAuth();
    const {setSearch} = useSearch();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        if(location.pathname !== "/vehicles"){
            setSearch("");
        }
    },[location.pathname]);

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    return(
        //Brand heading
        <div className="brand">
            <h1 style={{cursor: "pointer"}} onClick={() => {navigate('/dashboard')}}>CARFIELD</h1>

            <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "12px"}}>
                {location.pathname === "/vehicles" && (
                    <input type="text" placeholder="Search brand or model" onChange={e => setSearch(e.target.value)} className="search-input-field" />
                )}

                {user ? null : (
                    <button className="loginBtn" onClick={() => navigate('/login')}>SIGN IN / UP</button>
                )}
                {user ? (
                    <div style={{display: "flex", flexDirection: "row", gap: "5px", marginRight: "20px"}}>
                        <button style={{ position: "relative", cursor: "pointer", backgroundColor: "#ffffff00", border: "none", padding: "10px" }} onClick={() => navigate("/notifications")} className="tooltip-wrapper" data-tooltip="Notifications">
                            <i className="bi bi-bell-fill" style={{ fontSize: "20px", color: "var(--gold)" }} />
                            {unreadCount > 0 && (
                                <span style={{
                                position: "absolute", top: "3px", right: "0px",
                                backgroundColor: "red", color: "white",
                                fontSize: "10px", fontWeight: 700, padding: "10px",
                                borderRadius: "50%", width: "16px", height: "16px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                {unreadCount}
                                </span>
                            )}
                        </button>
                        <button onClick={toggleTheme}
                            style={{
                                background: "none", border: "none",
                                color: "var(--gold)", fontSize: "25px",
                                cursor: "pointer", padding: "7px",
                            }} className="tooltip-wrapper" data-tooltip={isDark ? "Light mode" : "dark mode"}
                        >
                            <i className={isDark ? "bi bi-brightness-high-fill" : "bi bi-brightness-high-fill"} />
                        </button>
                        {location.pathname !== "/profile" && (
                            <button onClick={() => setShowLogoutModal(true)}
                                style={{
                                    position: "relative", marginTop: "8px",
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "10px", border: "none",
                                    width: "37px", height: "35px", backgroundColor: "#00000000",
                                    color: "#c9a84c", fontSize: 23, cursor: "pointer", fontWeight: 500,
                                }} className="tooltip-wrapper" data-tooltip="Logout"
                            >
                            <i className="bi bi-power" />
                            </button>
                        )}
                    </div>
                    ) : null
                }
            </div>

            {showLogoutModal && (
                <div
                    onClick={(e) => { if (e.target === e.currentTarget) setShowLogoutModal(false); }}
                    style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div className="logout-dialogbox">
                        <p style={{ marginBottom: "22px", fontSize: "14px" }}>
                            Are you sure you want to log out?
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="btn-delete"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="btn-edit"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TopHeader;