import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import Particles from "../component/loginComponent/Particles";
import Field from "../component/loginComponent/Field";
import PasswordStrength from "../component/loginComponent/PasswordStrength";

/* ─── Google Button ──────────────────────────────────────────────── */
function GoogleButton() {
  return (
    <button
      type="button"
      className="auth-google-btn"
      onClick={() => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
      }}
    >
      <svg className="auth-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Continue with Google
    </button>
  );
}

/* ─── Main Auth Page ─────────────────────────────────────────────── */
export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState("signin");
  const [animating, setAnimating] = useState(false);

  /* sign-in state */
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siError, setSiError] = useState("");
  const [siLoading, setSiLoading] = useState(false);

  /* sign-up state */
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPhone, setSuPhone] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suError, setSuError] = useState("");
  const [suLoading, setSuLoading] = useState(false);

  const isSignIn = tab === "signin";

  const switchTab = (t) => {
    if (t === tab || animating) return;
    setAnimating(true);
    setSiError("");
    setSuError("");
    setTimeout(() => {
      setTab(t);
      setAnimating(false);
    }, 220);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSiError("");
    if (!siEmail.trim() || !siPassword.trim()) {
      setSiError("Please enter your email and password.");
      return;
    }
    setSiLoading(true);
    try {
      await login(siEmail, siPassword);
      navigate("/");
    } catch (err) {
      setSiError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuError("");
    if (!suName.trim() || !suEmail.trim() || !suPhone.trim() || !suPassword.trim() || !suConfirm.trim()) {
      setSuError("All fields are required.");
      return;
    }
    if (suPassword.length < 8) {
      setSuError("Password must be at least 8 characters.");
      return;
    }
    if (suPassword !== suConfirm) {
      setSuError("Passwords do not match.");
      return;
    }
    if (!/^\d{10}$/.test(suPhone)) {
      setSuError("Phone must be exactly 10 digits.");
      return;
    }
    setSuLoading(true);
    try {
      await register(suName, suEmail, suPassword, `+91 ${suPhone}`);
      navigate("/");
    } catch (err) {
      setSuError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSuLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background layers */}
      <div className="auth-bg-layer1" />
      <div className="auth-bg-layer2" />
      <div className="auth-bg-grid" />
      <Particles />

      {/* Brand stamp */}
      <button className="auth-brand-btn" onClick={() => navigate("/")}>
        <span className="auth-brand-text">CARFIELD</span>
        <span className="auth-brand-sub">PREMIUM SHOWROOM</span>
      </button>

      {/* Card */}
      <div className="auth-card">
        {/* Corner accents */}
        <div className="auth-corner auth-corner--tl" />
        <div className="auth-corner auth-corner--tr" />
        <div className="auth-corner auth-corner--bl" />
        <div className="auth-corner auth-corner--br" />

        {/* Header */}
        <div className="auth-card-header">
          <div className="auth-icon-badge">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"
                stroke="#c9a84c"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="#c9a84c" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="1" fill="#c9a84c" />
            </svg>
          </div>
          <h1 className="auth-card-title">
            {isSignIn ? "Welcome back" : "Create account"}
          </h1>
          <p className="auth-card-sub">
            {isSignIn
              ? "Sign in to access your showroom dashboard"
              : "Join CarField and explore premium vehicles"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tab-bar">
          <button
            onClick={() => switchTab("signin")}
            className={`auth-tab-btn ${isSignIn ? "auth-tab-btn--active" : "auth-tab-btn--inactive"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab("signup")}
            className={`auth-tab-btn ${!isSignIn ? "auth-tab-btn--active" : "auth-tab-btn--inactive"}`}
          >
            Sign Up
          </button>
          <div
            className={`auth-tab-indicator ${isSignIn ? "auth-tab-indicator--signin" : "auth-tab-indicator--signup"}`}
          />
        </div>

        {/* Form area */}
        <div
          className={`auth-form-area ${
            animating ? "auth-form-area--animating" : "auth-form-area--visible"
          }`}
        >
          {/* Sign In form */}
          {isSignIn && (
            <form onSubmit={handleSignIn} autoComplete="on">
              <Field
                icon="✉"
                label="Email address"
                type="email"
                value={siEmail}
                onChange={(e) => setSiEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Field
                icon="🔑"
                label="Password"
                type="password"
                value={siPassword}
                onChange={(e) => setSiPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {siError && <p className="auth-error-msg">{siError}</p>}

              <button
                type="submit"
                disabled={siLoading}
                className="auth-submit-btn"
                style={{ opacity: siLoading ? 0.65 : 1 }}
              >
                {siLoading ? (
                  <span className="auth-spinner-row">
                    <span className="auth-spinner" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>

              <GoogleButton />

              <p className="auth-switch-hint">
                New to CarField?{" "}
                <span className="auth-switch-link" onClick={() => switchTab("signup")}>
                  Create an account
                </span>
              </p>
            </form>
          )}

          {/* Sign Up form */}
          {!isSignIn && (
            <form onSubmit={handleSignUp} autoComplete="on">
              <Field
                icon="👤"
                label="Full name"
                value={suName}
                onChange={(e) => setSuName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
              <Field
                icon="✉"
                label="Email address"
                type="email"
                value={suEmail}
                onChange={(e) => setSuEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Field
                icon="📱"
                label="Phone (10 digits)"
                type="tel"
                value={suPhone}
                onChange={(e) => setSuPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
                placeholder="9876543210"
                autoComplete="tel"
              />

              <div className="auth-password-grid">
                <Field
                  icon="🔑"
                  label="Password"
                  type="password"
                  value={suPassword}
                  onChange={(e) => setSuPassword(e.target.value)}
                  placeholder="Min 8 chars"
                  autoComplete="new-password"
                  className="password-field"
                />
                <Field
                  icon="🔒"
                  label="Confirm"
                  type="password"
                  value={suConfirm}
                  onChange={(e) => setSuConfirm(e.target.value)}
                  placeholder="Repeat"
                  autoComplete="new-password"
                  className="password-field"
                />
              </div>

              {suPassword.length > 0 && <PasswordStrength password={suPassword} />}

              {suError && <p className="auth-error-msg">{suError}</p>}

              <button
                type="submit"
                disabled={suLoading}
                className="auth-submit-btn"
                style={{ opacity: suLoading ? 0.65 : 1 }}
              >
                {suLoading ? (
                  <span className="auth-spinner-row">
                    <span className="auth-spinner" />
                    Creating account…
                  </span>
                ) : (
                  "Create Account →"
                )}
              </button>

              <GoogleButton />

              <p className="auth-switch-hint">
                Already have an account?{" "}
                <span className="auth-switch-link" onClick={() => switchTab("signin")}>
                  Sign in here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Tagline */}
      <p className="auth-tagline">
        Premium automobiles · Trusted experience · India&apos;s finest
      </p>
    </div>
  );
}