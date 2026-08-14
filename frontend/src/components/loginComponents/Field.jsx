import { useState } from "react";

function Field({ icon, label, type = "text", value, onChange, placeholder, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPwd ? "text" : "password") : type;

  return (
    <div className="auth-field-wrap">
      <label className="auth-field-label">{label}</label>
      <div className={`auth-field-inner${focused ? " auth-field-inner--focused" : ""}`}>
        <span className="auth-field-icon">{icon}</span>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="auth-field-input"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd((p) => !p)}
            className="auth-eye-btn"
            tabIndex={-1}
          >
            {showPwd ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Field;