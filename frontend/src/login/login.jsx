import { useState } from "react";
import { useAuth } from "../context/auth/useAuth";

// ── country list with per-country digit rules ──────────────────
const COUNTRIES = [
  { name: "India",          code: "+91",  digits: { min: 10, max: 10 } },
  { name: "United States",  code: "+1",   digits: { min: 10, max: 10 } },
  { name: "United Kingdom", code: "+44",  digits: { min: 10, max: 10 } },
  { name: "Canada",         code: "+1",   digits: { min: 10, max: 10 } },
  { name: "Australia",      code: "+61",  digits: { min: 9,  max: 9  } },
  { name: "Germany",        code: "+49",  digits: { min: 10, max: 11 } },
  { name: "France",         code: "+33",  digits: { min: 9,  max: 9  } },
  { name: "Japan",          code: "+81",  digits: { min: 10, max: 11 } },
  { name: "China",          code: "+86",  digits: { min: 11, max: 11 } },
  { name: "Brazil",         code: "+55",  digits: { min: 10, max: 11 } },
  { name: "South Africa",   code: "+27",  digits: { min: 9,  max: 9  } },
  { name: "UAE",            code: "+971", digits: { min: 9,  max: 9  } },
  { name: "Saudi Arabia",   code: "+966", digits: { min: 9,  max: 9  } },
  { name: "Singapore",      code: "+65",  digits: { min: 8,  max: 8  } },
  { name: "Malaysia",       code: "+60",  digits: { min: 9,  max: 10 } },
  { name: "Pakistan",       code: "+92",  digits: { min: 10, max: 10 } },
  { name: "Bangladesh",     code: "+880", digits: { min: 10, max: 10 } },
  { name: "Sri Lanka",      code: "+94",  digits: { min: 9,  max: 9  } },
  { name: "Nepal",          code: "+977", digits: { min: 10, max: 10 } },
  { name: "Nigeria",        code: "+234", digits: { min: 10, max: 10 } },
  { name: "Kenya",          code: "+254", digits: { min: 9,  max: 9  } },
  { name: "Mexico",         code: "+52",  digits: { min: 10, max: 10 } },
  { name: "Argentina",      code: "+54",  digits: { min: 10, max: 10 } },
  { name: "Indonesia",      code: "+62",  digits: { min: 9,  max: 12 } },
  { name: "Philippines",    code: "+63",  digits: { min: 10, max: 10 } },
];

function LoginTab({ onClose }) {

    const { register, login } = useAuth();

    const [activeTab, setActiveTab] = useState("register");

    const [userName,        setUserName]        = useState("");
    const [email,           setEmail]           = useState("");
    const [password,        setPassword]        = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ── store the selected country NAME, derive code from it ──
    const [selectedCountry, setSelectedCountry] = useState("India");
    const [phone,           setPhone]           = useState("");
    const [error, setError] = useState("");

    // ── when user picks a different country, update selected name ──
    function handleCountryChange(e) {
        setSelectedCountry(e.target.value);
        setPhone(""); // clear phone when country changes
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

        // ── look up the selected country's digit rules ──
        const countryData = COUNTRIES.find(c => c.name === selectedCountry);
        const { min, max } = countryData.digits;

        if (min === max) {
            // exact digit count required (e.g. India = exactly 10)
            if (phone.length !== min) {
                setError(`Phone number for ${selectedCountry} must be exactly ${min} digits.`);
                return;
            }
        } else {
            // range allowed (e.g. Germany = 10 or 11)
            if (phone.length < min || phone.length > max) {
                setError(`Phone number for ${selectedCountry} must be ${min}–${max} digits.`);
                return;
            }
        }

        // ── combine country code + number ──
        const fullPhone = `${countryData.code} ${phone}`;

        try {
            await register(userName, email, password, fullPhone);
            setUserName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setSelectedCountry("India");
            setPhone("");
            setActiveTab('');
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

                                {/* country selector — value is country NAME */}
                                <select
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                    style={{ padding: "4px", borderRadius: "4px" }}
                                >
                                    {COUNTRIES.map((c) => (
                                        <option key={c.name} value={c.name}>
                                            {c.name} ({c.code})
                                        </option>
                                    ))}
                                </select>

                                {/* phone number input */}
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