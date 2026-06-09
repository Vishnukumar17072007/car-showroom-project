import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/auth/useAuth";
import { useSearch } from "../context/search/useSearch";
import { useNotification } from "../context/notification/useNotification";

function TopHeader() {

    const navigate = useNavigate();
    const location = useLocation();

      const { unreadCount } = useNotification();
    
    const {user, logout} = useAuth();
    const {setSearch} = useSearch();

    useEffect(() => {
        if(location.pathname !== "/vehicles"){
            setSearch("");
        }
    },[location.pathname]);

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
                    <div>
                        <div style={{ position: "relative", cursor: "pointer", margin: "12px" }} onClick={() => navigate("/notifications")}>
                            <i className="bi bi-bell" style={{ fontSize: "20px", color: "var(--text)" }} />
                            {unreadCount > 0 && (
                                <span style={{
                                position: "absolute", top: "-6px", right: "-6px",
                                backgroundColor: "red", color: "white",
                                fontSize: "10px", fontWeight: 700,
                                borderRadius: "50%", width: "16px", height: "16px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                {unreadCount}
                                </span>
                            )}
                        </div>
                        <div onClick={() => logout()}>
                        <i className="bi bi-power">Logout</i>
                        </div>
                    </div>
                    ) : null
                }
            </div>
        </div>
    );
}

export default TopHeader;