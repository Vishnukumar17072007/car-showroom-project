import { useAuth } from "../context/auth/useAuth";

function SubscriptionModal({ onClose }){

    const { user } = useAuth();
    const currentPlan = user?.subscription || null;

    const plans = [
        {
            name: "Free 🌏",
            key: "free",
            price: "0 INR/month",
            color: "#00ff55",
            features: ["can buy cars through web site"]
        },
        {
            name: "Pro 🚀",
            key: "pro",
            price: "100 INR/month",
            color: "#0077b6",
            features: ["Everything in Free modal", "Free door delivery", "Discounts will be applied for cars"]
        },
        {
            name: "Premium ⭐",
            key: "premium",
            price: "500 INR/month",
            color: "#f7971e",
            features: ["Everything in pro modal","Free merchents while buying cars"]
        }
    ];
    return (
        <div onClick={onClose} 
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(6px)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <div onClick={e => e.stopPropagation()} className="planModals">
                {/* Close button */}
                <button onClick={onClose} className="close" style={{color: "white"}} >✕</button>

                <h4 style={{ textAlign: "center", marginBottom: "8px" }}>
                    Choose Your Plan
                </h4>
                <p style={{ textAlign: "center", color: "#aaa", fontSize: "13px", marginBottom: "24px" }}>
                    Unlock features based on your subscription
                </p>

                {/* Plan cards */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                    {plans.map((plan) => {

                        const isCurrent = currentPlan === plan.key;

                        return (
                            <div
                                key={plan.key}
                                style={{
                                    flex: "1",
                                    minWidth: "180px",
                                    background: "#16213e",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    border: isCurrent
                                        ? `2px solid ${plan.color}`
                                        : "2px solid transparent",
                                    position: "relative"
                                }}
                            >
                                {isCurrent && (
                                    <span style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        background: plan.color,
                                        color: "white",
                                        fontSize: "10px",
                                        padding: "2px 8px",
                                        borderRadius: "20px",
                                        fontWeight: "bold"
                                    }}>
                                        Current
                                    </span>
                                )}

                                <h5 style={{ color: plan.color, marginBottom: "4px" }}>{plan.name}</h5>
                                <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
                                    {plan.price}
                                </p>

                                <ul style={{ paddingLeft: "16px", fontSize: "12px", color: "#ccc", marginBottom: "16px" }}>
                                    {plan.features.map((f, i) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>

                                <button
                                    disabled={isCurrent}
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: isCurrent ? "#333" : plan.color,
                                        color: isCurrent ? "#888" : "white",
                                        fontWeight: "600",
                                        cursor: isCurrent ? "not-allowed" : "pointer",
                                        fontSize: "13px"
                                    }}
                                >
                                    {isCurrent ? "Current Plan" : `Get ${plan.name}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default SubscriptionModal;
