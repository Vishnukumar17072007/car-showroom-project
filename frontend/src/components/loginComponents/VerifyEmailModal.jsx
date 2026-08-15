import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/auth/useAuth";
import { useNavigate } from "react-router-dom";
import Field from "./Field";

export default function VerifyEmailModal({ email, onClose }) {
  const { verifyEmail, resendEmailOtp } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [visible, setVisible] = useState(false);
  const cooldownRef = useRef(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    startCooldown(); // an OTP was just sent by the register() call, so start cooldown immediately
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = () => {
    setResendCooldown(30);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClose = () => {
    clearInterval(cooldownRef.current);
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await resendEmailOtp(email);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-overlay-page ${visible ? "auth-overlay-page--visible" : ""}`}>
      <div className="auth-bg-layer1" />
      <div className="auth-bg-layer2" />
      <div className="auth-bg-grid" />

      <button type="button" className="auth-overlay-back" onClick={handleClose}>
        ← Back
      </button>

      <div className="auth-card auth-overlay-card">
        <div className="auth-corner auth-corner--tl" />
        <div className="auth-corner auth-corner--tr" />
        <div className="auth-corner auth-corner--bl" />
        <div className="auth-corner auth-corner--br" />

        <div className="auth-card-header">
          <h1 className="auth-card-title">Verify your email</h1>
          <p className="auth-card-sub">
            We sent a 6-digit code to <strong>{email}</strong>. Enter it below to activate your account.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <Field
            icon="🔑"
            label="Verification code"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            autoComplete="one-time-code"
          />
          {error && <p className="auth-error-msg">{error}</p>}
          <button type="submit" disabled={loading} className="auth-submit-btn" style={{ opacity: loading ? 0.65 : 1 }}>
            {loading ? (
              <span className="auth-spinner-row">
                <span className="auth-spinner" />
                Verifying…
              </span>
            ) : (
              "Verify & continue →"
            )}
          </button>
          <p className="auth-switch-hint">
            {resendCooldown > 0 ? (
              <span>Resend available in {resendCooldown}s</span>
            ) : (
              <span className="auth-switch-link" onClick={handleResend}>
                Resend code
              </span>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}