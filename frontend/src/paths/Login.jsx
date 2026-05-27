import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

/* ─── Particle background component ─────────────────────────────── */
function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${d.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Input Field ──────────────────────────────────────────────── */
function Field({ icon, label, type = "text", value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPwd ? "text" : "password") : type;

  return (
    <div style={{ position: "relative", marginBottom: "18px" }}>
      <label style={styles.fieldLabel}>{label}</label>
      <div
        style={{
          ...styles.fieldWrap,
          borderColor: focused ? "#c9a84c" : "rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.12)" : "none",
        }}
      >
        <span style={styles.fieldIcon}>{icon}</span>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.fieldInput}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd((p) => !p)}
            style={styles.eyeBtn}
            tabIndex={-1}
          >
            {showPwd ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Auth Page ───────────────────────────────────────────── */
export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState("signin"); // "signin" | "signup"
  const [animating, setAnimating] = useState(false);

  /* ── sign-in state ── */
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siError, setSiError] = useState("");
  const [siLoading, setSiLoading] = useState(false);

  /* ── sign-up state ── */
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPhone, setSuPhone] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suError, setSuError] = useState("");
  const [suLoading, setSuLoading] = useState(false);

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

  const isSignIn = tab === "signin";

  return (
    <div style={styles.page}>
      {/* ── background layers ── */}
      <div style={styles.bgLayer1} />
      <div style={styles.bgLayer2} />
      <div style={styles.bgGrid} />
      <Particles />

      {/* ── brand stamp top-left ── */}
      <button
        onClick={() => navigate("/")}
        style={styles.brandBtn}
      >
        <span style={styles.brandText}>CARFIELD</span>
        <span style={styles.brandSub}>PREMIUM SHOWROOM</span>
      </button>

      {/* ── card ── */}
      <div style={styles.card}>
        {/* decorative corner accents */}
        <div style={{ ...styles.corner, top: -1, left: -1, borderTopColor: "#c9a84c", borderLeftColor: "#c9a84c" }} />
        <div style={{ ...styles.corner, top: -1, right: -1, borderTopColor: "#c9a84c", borderRightColor: "#c9a84c" }} />
        <div style={{ ...styles.corner, bottom: -1, left: -1, borderBottomColor: "#c9a84c", borderLeftColor: "#c9a84c" }} />
        <div style={{ ...styles.corner, bottom: -1, right: -1, borderBottomColor: "#c9a84c", borderRightColor: "#c9a84c" }} />

        {/* header */}
        <div style={styles.cardHeader}>
          <div style={styles.iconBadge}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="#c9a84c" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="1" fill="#c9a84c" />
            </svg>
          </div>
          <h1 style={styles.cardTitle}>
            {isSignIn ? "Welcome back" : "Create account"}
          </h1>
          <p style={styles.cardSub}>
            {isSignIn
              ? "Sign in to access your showroom dashboard"
              : "Join CarField and explore premium vehicles"}
          </p>
        </div>

        {/* tab switcher */}
        <div style={styles.tabBar}>
          <button
            onClick={() => switchTab("signin")}
            style={{
              ...styles.tabBtn,
              ...(isSignIn ? styles.tabActive : styles.tabInactive),
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => switchTab("signup")}
            style={{
              ...styles.tabBtn,
              ...(!isSignIn ? styles.tabActive : styles.tabInactive),
            }}
          >
            Sign Up
          </button>
          {/* sliding indicator */}
          <div
            style={{
              ...styles.tabIndicator,
              left: isSignIn ? "4px" : "calc(50% + 4px)",
            }}
          />
        </div>

        {/* form area */}
        <div
          style={{
            ...styles.formArea,
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
          }}
        >
          {/* ─── SIGN IN ─── */}
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

              {siError && <p style={styles.errorMsg}>{siError}</p>}

              <button
                type="submit"
                disabled={siLoading}
                style={{ ...styles.submitBtn, opacity: siLoading ? 0.65 : 1 }}
              >
                {siLoading ? (
                  <span style={styles.spinnerRow}>
                    <span style={styles.spinner} />
                    Signing in…
                  </span>
                ) : (
                  "Sign In →"
                )}
              </button>

              <p style={styles.switchHint}>
                New to CarField?{" "}
                <span style={styles.switchLink} onClick={() => switchTab("signup")}>
                  Create an account
                </span>
              </p>
            </form>
          )}

          {/* ─── SIGN UP ─── */}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field
                  icon="🔑"
                  label="Password"
                  type="password"
                  value={suPassword}
                  onChange={(e) => setSuPassword(e.target.value)}
                  placeholder="Min 8 chars"
                  autoComplete="new-password"
                />
                <Field
                  icon="🔒"
                  label="Confirm"
                  type="password"
                  value={suConfirm}
                  onChange={(e) => setSuConfirm(e.target.value)}
                  placeholder="Repeat"
                  autoComplete="new-password"
                />
              </div>

              {/* password strength indicator */}
              {suPassword.length > 0 && (
                <PasswordStrength password={suPassword} />
              )}

              {suError && <p style={styles.errorMsg}>{suError}</p>}

              <button
                type="submit"
                disabled={suLoading}
                style={{ ...styles.submitBtn, opacity: suLoading ? 0.65 : 1 }}
              >
                {suLoading ? (
                  <span style={styles.spinnerRow}>
                    <span style={styles.spinner} />
                    Creating account…
                  </span>
                ) : (
                  "Create Account →"
                )}
              </button>

              <p style={styles.switchHint}>
                Already have an account?{" "}
                <span style={styles.switchLink} onClick={() => switchTab("signin")}>
                  Sign in here
                </span>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ── bottom tagline ── */}
      <p style={styles.tagline}>
        Premium automobiles · Trusted experience · India&apos;s finest
      </p>

      <style>{`
        @keyframes authSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes authFadeIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
      `}</style>
    </div>
  );
}

/* ─── Password strength meter ─────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#e05252", "#f39c12", "#3db87a", "#c9a84c"];

  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {checks.map((ok, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: i < score ? colors[score - 1] : "rgba(255,255,255,0.1)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "11px", color: score > 0 ? colors[score - 1] : "#888" }}>
        {score > 0 ? labels[score - 1] : ""}
      </span>
    </div>
  );
}

/* ─── Styles object ───────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    position: "relative",
    overflow: "hidden",
    background: "#080810",
    fontFamily: "'DM Sans', Arial, sans-serif",
  },

  bgLayer1: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse 70% 55% at 20% 10%, rgba(201,168,76,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(201,168,76,0.05) 0%, transparent 55%)",
    pointerEvents: "none",
  },

  bgLayer2: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.015) 0%, transparent 70%)",
    pointerEvents: "none",
  },

  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },

  brandBtn: {
    position: "fixed",
    top: "20px",
    left: "24px",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "1px",
    padding: 0,
    zIndex: 10,
  },

  brandText: {
    fontFamily: "'Syne', Arial, sans-serif",
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: "#c9a84c",
  },

  brandSub: {
    fontSize: "8px",
    letterSpacing: "2px",
    color: "rgba(201,168,76,0.45)",
    textTransform: "uppercase",
  },

  card: {
    position: "relative",
    width: "100%",
    maxWidth: "480px",
    background: "rgba(17,17,23,0.92)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "40px 36px 36px",
    backdropFilter: "blur(20px)",
    boxShadow:
      "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08) inset",
    animation: "authFadeIn 0.55s cubic-bezier(.22,1,.36,1) both",
    zIndex: 2,
  },

  corner: {
    position: "absolute",
    width: "18px",
    height: "18px",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "2px",
    pointerEvents: "none",
  },

  cardHeader: {
    textAlign: "center",
    marginBottom: "28px",
  },

  iconBadge: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "rgba(201,168,76,0.08)",
    border: "1px solid rgba(201,168,76,0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },

  cardTitle: {
    fontFamily: "'Syne', Arial, sans-serif",
    fontSize: "26px",
    fontWeight: 700,
    color: "#f0ede6",
    margin: "0 0 6px",
    letterSpacing: "0.3px",
  },

  cardSub: {
    fontSize: "13px",
    color: "#6a6778",
    margin: 0,
    lineHeight: 1.5,
  },

  tabBar: {
    position: "relative",
    display: "flex",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "10px",
    padding: "4px",
    marginBottom: "28px",
  },

  tabBtn: {
    flex: 1,
    padding: "9px",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'DM Sans', Arial, sans-serif",
    position: "relative",
    zIndex: 1,
    transition: "color 0.25s",
    background: "transparent",
  },

  tabActive: {
    color: "#c9a84c",
  },

  tabInactive: {
    color: "#6a6778",
  },

  tabIndicator: {
    position: "absolute",
    top: "4px",
    width: "calc(50% - 8px)",
    height: "calc(100% - 8px)",
    background: "rgba(201,168,76,0.1)",
    border: "1px solid rgba(201,168,76,0.25)",
    borderRadius: "7px",
    transition: "left 0.25s cubic-bezier(.22,1,.36,1)",
    pointerEvents: "none",
  },

  formArea: {
    transition: "opacity 0.22s ease, transform 0.22s ease",
  },

  fieldLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#6a6778",
    marginBottom: "6px",
  },

  fieldWrap: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid",
    borderRadius: "10px",
    padding: "0 12px",
    transition: "border-color 0.18s, box-shadow 0.18s",
  },

  fieldIcon: {
    fontSize: "14px",
    marginRight: "10px",
    opacity: 0.5,
    userSelect: "none",
    lineHeight: 1,
  },

  fieldInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f0ede6",
    fontSize: "14px",
    padding: "12px 0",
    fontFamily: "'DM Sans', Arial, sans-serif",
  },

  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    opacity: 0.4,
    padding: "0 0 0 8px",
    lineHeight: 1,
    transition: "opacity 0.15s",
  },

  errorMsg: {
    background: "rgba(224,82,82,0.1)",
    border: "1px solid rgba(224,82,82,0.25)",
    color: "#e05252",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "16px",
    lineHeight: 1.4,
  },

  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
    backgroundSize: "200% 100%",
    backgroundPosition: "0% 50%",
    border: "none",
    borderRadius: "10px",
    color: "#080810",
    fontFamily: "'Syne', Arial, sans-serif",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "background-position 0.4s, transform 0.15s, opacity 0.2s",
    marginBottom: "16px",
  },

  spinnerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(8,8,16,0.3)",
    borderTopColor: "#080810",
    borderRadius: "50%",
    animation: "authSpin 0.7s linear infinite",
  },

  switchHint: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6a6778",
    margin: 0,
  },

  switchLink: {
    color: "#c9a84c",
    cursor: "pointer",
    fontWeight: 500,
    textDecoration: "underline",
    textDecorationColor: "rgba(201,168,76,0.35)",
    textUnderlineOffset: "3px",
  },

  tagline: {
    marginTop: "28px",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "rgba(201,168,76,0.3)",
    textAlign: "center",
    zIndex: 2,
    position: "relative",
  },
};