import { useState } from "react";
import LoginTab from "../login/login";
import { useAuth } from "../context/auth/useAuth";
import { useSearch } from "../context/search/useSearch";
import { useNavigate } from "react-router-dom";

function TopHeader() {

    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);

    const {user} = useAuth();
    const {setSearch} = useSearch();

    return(
        //Brand heading
        <div className="brand">
            <h1 style={{cursor: "pointer"}} onClick={() => {navigate('/')}}>BOTSALES</h1>

            <input type="text" placeholder="Search brand or model" onChange={e => setSearch(e.target.value)} className="search-input-field" />

            {user ? null : (
                <button className="loginBtn" onClick={() => {setShowLogin(true)}}>Login</button>
            )}
            {showLogin && <LoginTab onClose={()=>setShowLogin(false)} />}
        </div>
    );
}

export default TopHeader