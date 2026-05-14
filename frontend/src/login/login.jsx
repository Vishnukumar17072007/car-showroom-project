import { useState } from "react";
import { useAuth } from "../context/auth/useAuth";

// ── country list ──────────────────────────────────────────────
const COUNTRIES = [
  { name: "India",          code: "+91"  },
  { name: "United States",  code: "+1"   },
  { name: "United Kingdom", code: "+44"  },
  { name: "Canada",         code: "+1"   },
  { name: "Australia",      code: "+61"  },
  { name: "Germany",        code: "+49"  },
  { name: "France",         code: "+33"  },
  { name: "Japan",          code: "+81"  },
  { name: "China",          code: "+86"  },
  { name: "Brazil",         code: "+55"  },
  { name: "South Africa",   code: "+27"  },
  { name: "UAE",            code: "+971" },
  { name: "Saudi Arabia",   code: "+966" },
  { name: "Singapore",      code: "+65"  },
  { name: "Malaysia",       code: "+60"  },
  { name: "Pakistan",       code: "+92"  },
  { name: "Bangladesh",     code: "+880" },
  { name: "Sri Lanka",      code: "+94"  },
  { name: "Nepal",          code: "+977" },
  { name: "Nigeria",        code: "+234" },
  { name: "Kenya",          code: "+254" },
  { name: "Mexico",         code: "+52"  },
  { name: "Argentina",      code: "+54"  },
  { name: "Indonesia",      code: "+62"  },
  { name: "Philippines",    code: "+63"  },
];

function LoginTab({ onClose }) {

    const { register, login } = useAuth();

    const [activeTab, setActiveTab] = useState("register");

    const [userName,        setUserName]        = useState("");
    const [email,           setEmail]           = useState("");
    const [password,        setPassword]        = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ── new phone states ──
    const [countryCode, setCountryCode] = useState("+91");   // default: India
    const [phone,       setPhone]       = useState("");

    const [error, setError] = useState("");

    // ── when user picks a different country, update the dial code ──
    function handleCountryChange(e) {
        const selected = COUNTRIES.find(c => c.name === e.target.value);
        if (selected) setCountryCode(selected.code);
    }

    async function handleLogin(e) {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            await login(email, password);
            setEmail("");
            setPassword("");
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setError("");

        // ── existing validations ──
        if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("All fields are required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // ── phone validations ──
        if (!phone.trim()) {
            setError("Phone number is required.");
            return;
        }
        if (!/^\d+$/.test(phone)) {
            setError("Phone number must contain digits only.");
            return;
        }
        if (phone.length < 7 || phone.length > 15) {
            setError("Enter a valid phone number (7–15 digits).");
            return;
        }

        // ── combine country code + number ──
        const fullPhone = `${countryCode} ${phone}`;   // e.g. "+91 9876543210"

        try {
            await register(userName, email, password, fullPhone); // ← pass fullPhone
            setUserName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setCountryCode("+91");
            setPhone("");
            setActiveTab("login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="overlay" onClick={onClose}>
            <div className="loginForm" onClick={(e) => e.stopPropagation()}>
                <p className="close" onClick={onClose}>X</p>

                {/* tabs */}
                <div className="tabs">
                    <div
                        onClick={() => { setActiveTab("login"); setError(""); }}
                        style={{ fontWeight: activeTab === "login" ? "bold" : "normal", cursor: "pointer", fontSize: "20px" }}
                    >
                        Login
                    </div>
                    <div className="divider" style={{ fontSize: "23px", fontWeight: "bold" }}>/</div>
                    <div
                        onClick={() => { setActiveTab("register"); setError(""); }}
                        style={{ fontWeight: activeTab === "register" ? "bold" : "normal", cursor: "pointer", fontSize: "20px" }}
                    >
                        Register
                    </div>
                </div>

                {/* login form */}
                {activeTab === "login" && (
                    <form className="logForm" onSubmit={handleLogin}>
                        <div>
                            <label>Email : </label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label>Password : </label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <button className="btn auth-submit-btn" type="submit">Login</button>
                    </form>
                )}

                {/* register form */}
                {activeTab === "register" && (
                    <form className="logForm" onSubmit={handleRegister}>
                        <div>
                            <label>Username : </label>
                            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div>
                            <label>Email : </label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {/* ── phone number row ── */}
                        <div>
                            <label>Phone : </label>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>

                                {/* country selector — shows name, stores dial code */}
                                <select
                                    className="container-fluid"
                                    onChange={handleCountryChange}
                                    defaultValue="India"
                                    style={{ padding: "4px", borderRadius: "4px", width: "100px" }}
                                >
                                    {COUNTRIES.map((c) => (
                                        <option key={c.name} value={c.name}>
                                            {c.name} ({c.code})
                                        </option>
                                    ))}
                                </select>

                                {/* phone number input — digits only */}
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                            </div>
                        </div>

                        <div>
                            <label>Password : </label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <label>Confirm Password : </label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <button className="btn auth-submit-btn" type="submit">Create Account</button><br />
                        <p>Already have an account?{" "}
                            <span onClick={() => setActiveTab("login")} style={{ color: "blue", cursor: "pointer" }}>
                                Click Here
                            </span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default LoginTab;