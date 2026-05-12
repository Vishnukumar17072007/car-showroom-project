import { useState } from "react";
import { useAuth } from "../context/auth/useAuth";

function LoginTab({ onClose }){

    const {register, login} = useAuth();

    const [activeTab, setActiveTab] = useState("register");

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
    
        // ✅ check before hitting the API
        if (!email.trim() || !password.trim()) {
            setError('Please enter your email and password.');
            return;
        }
    
        try {
            await login(email, password);
            setEmail('');
            setPassword('');
            onClose();
        } catch(err) {
            setError(err.response?.data?.message || "Login failed");
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        setError('');
    
        // ✅ empty field check
        if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('All fields are required.');
            return;
        }
        // ✅ minimum password length
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        // ✅ return added — previously the API call ran even when this failed
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return; // ← this was missing
        }
    
        try {
            await register(userName, email, password);
            setUserName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setActiveTab("login");
        } catch(err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    }  

    return(
        <div className="overlay" onClick={onClose}>
            <div className="loginForm" onClick={(e) => e.stopPropagation()}>
                <p className="close" onClick={onClose}>X</p>

                {/* tabs */}
                <div className="tabs">
                    <div
                        onClick={() => { setActiveTab("login"); setError("") }}
                        style={{ fontWeight: activeTab === "login" ? "bold" : "normal", cursor: "pointer", fontSize: "20px" }}
                    >
                        Login
                    </div>
                    <div className="divider" style={{fontSize: "23px", fontWeight: "bold"}}>/</div>
                    <div
                        onClick={() => { setActiveTab("register"); setError("") }}
                        style={{ fontWeight: activeTab === "register" ? "bold" : "normal", cursor: "pointer", fontSize: "20px"  }}
                    >
                        Register
                    </div>
                </div>

                {activeTab === "login" && (
                    <form className="logForm" onSubmit={handleLogin}>
                    <div>
                    <label>Email : </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/><br />
                    </div>
                    <div>
                    <label>Password : </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/><br />
                    </div>
                    {/* error message */}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button className="btn auth-submit-btn" type="submit">Login</button>
                    </form>
                )}

                {/* register form */}
                {activeTab === "register" && (
                <form className="logForm" onSubmit={handleRegister}>
                    <div>
                    <label>Username : </label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}/><br />
                    </div>
                    <div>
                    <label>Email : </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/><br />
                    </div>
                    <div>
                    <label>Password : </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                    </div>
                    <div>
                    <label>Confirm Password : </label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/><br />
                    </div>
                    {/* error message */}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button className="btn auth-submit-btn" type="submit">Create Account</button><br />
                    <p>Already have an account? <span onClick={() => setActiveTab("login")} style={{color: "blue", cursor: "pointer"}}>Click Here</span></p>
                </form>
                )}
            </div>
        </div>
    );
}

export default LoginTab;