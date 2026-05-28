const LABELS = ["Weak", "Fair", "Good", "Strong"];
const COLORS = ["#e05252", "#f39c12", "#3db87a", "#c9a84c"];

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  return (
    <div className="auth-strength-wrap">
      <div className="auth-strength-bars">
        {checks.map((_, i) => (
          <div
            key={i}
            className="auth-strength-bar"
            style={{
              background: i < score ? COLORS[score - 1] : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
      <span
        className="auth-strength-label"
        style={{ color: score > 0 ? COLORS[score - 1] : "#888" }}
      >
        {score > 0 ? LABELS[score - 1] : ""}
      </span>
    </div>
  );
}

export default PasswordStrength;