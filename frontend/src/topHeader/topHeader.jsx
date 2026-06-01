import { useEffect } from "react";
import { useAuth } from "../context/auth/useAuth";
import { useSearch } from "../context/search/useSearch";
import { useLocation, useNavigate } from "react-router-dom";

function TopHeader() {

    const navigate = useNavigate();
    const location = useLocation();

    const {user} = useAuth();
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

            {location.pathname === "/vehicles" && (
                <input type="text" placeholder="Search brand or model" onChange={e => setSearch(e.target.value)} className="search-input-field" />
            )}

            {user ? null : (
                <button className="loginBtn" onClick={() => navigate('/login')}>SIGN IN / UP</button>
            )}
        </div>
    );
}

export default TopHeader