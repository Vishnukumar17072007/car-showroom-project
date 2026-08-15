import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/auth/useAuth";
import Field from "./Field";
import PasswordStrength from "./PasswordStrength";

export default function ForgotPasswordModal({ onClose }) {
  const { requestPasswordOtp, verifyPasswordOtp, resetPassword } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [visible, setVisible] = useState(false); // controls enter transition
  const cooldownRef = useRef(null);

  // Trigger the enter transition on mount, lock background scroll while open
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
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
    // wait for the exit transition before actually unmounting
    setTimeout(onClose, 200);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordOtp(email.trim());
      setStep(2);
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await requestPasswordOtp(email.trim());
      startCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }
    setLoading(true);
    try {
      const { token } = await verifyPasswordOtp(email.trim(), otp);
      setResetToken(token);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim(), resetToken, newPassword);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't reset password. Try again.");
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
        ← Back to sign in
      </button>

      <div className="auth-card auth-overlay-card">
        <div className="auth-corner auth-corner--tl" />
        <div className="auth-corner auth-corner--tr" />
        <div className="auth-corner auth-corner--bl" />
        <div className="auth-corner auth-corner--br" />

        {step === 1 && (
          <>
            <div className="auth-card-header">
              <h1 className="auth-card-title">Reset your password</h1>
              <p className="auth-card-sub">
                Enter the email on your account and we'll send you a one-time code.
              </p>
            </div>
            <form onSubmit={handleSendOtp}>
              <Field
                icon="✉"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error && <p className="auth-error-msg">{error}</p>}
              <button type="submit" disabled={loading} className="auth-submit-btn" style={{ opacity: loading ? 0.65 : 1 }}>
                {loading ? (
                  <span className="auth-spinner-row">
                    <span className="auth-spinner" />
                    Sending…
                  </span>
                ) : (
                  "Send code →"
                )}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-card-header">
              <h1 className="auth-card-title">Check your email</h1>
              <p className="auth-card-sub">
                We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
              </p>
            </div>
            <form onSubmit={handleVerifyOtp}>
              <Field
                icon="🔑"
                label="OTP code"
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
                  "Verify code →"
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
          </>
        )}

        {step === 3 && (
          <>
            <div className="auth-card-header">
              <h1 className="auth-card-title">Set a new password</h1>
              <p className="auth-card-sub">Choose a new password for your account.</p>
            </div>
            <form onSubmit={handleReset}>
              <Field
                icon="🔑"
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars"
                autoComplete="new-password"
              />
              <Field
                icon="🔒"
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat"
                autoComplete="new-password"
              />
              {newPassword.length > 0 && <PasswordStrength password={newPassword} />}
              {error && <p className="auth-error-msg">{error}</p>}
              <button type="submit" disabled={loading} className="auth-submit-btn" style={{ opacity: loading ? 0.65 : 1 }}>
                {loading ? (
                  <span className="auth-spinner-row">
                    <span className="auth-spinner" />
                    Updating…
                  </span>
                ) : (
                  "Reset password →"
                )}
              </button>
            </form>
          </>
        )}

        {step === 4 && (
          <div className="auth-card-header">
            <h1 className="auth-card-title">Password updated</h1>
            <p className="auth-card-sub">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button type="button" className="auth-submit-btn" onClick={handleClose}>
              Back to sign in →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}