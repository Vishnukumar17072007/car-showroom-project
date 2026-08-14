import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart/useCart";
import { useWishList } from "../context/wish/useWishList";
import { useAuth } from "../context/auth/useAuth";
import { useState, useEffect } from "react";
import { CarDetailsSkeleton } from "../components/PageSkeletons";
import { getCarById } from "../context/car/carProvider";

function CarDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const { addToCart, removeFromCart, isInCart } = useCart();
    const { addToWishList, removeFromWishList, isInWishList } = useWishList();

    const [activeImg, setActiveImg] = useState(0);
    const [emiMonths, setEmiMonths] = useState(36);
    const [carDetails, setCarDetails] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const gallery = [
        carDetails?.frontImage,
        carDetails?.leftSideImage,
        carDetails?.rightSideImage,
        carDetails?.rearImage,
        carDetails?.image
    ].filter(Boolean);

    useEffect(() => {
        if (!gallery.length) return;

        const interval = setInterval(() => {
            setActiveImg((prev) => (prev + 1) % gallery.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [gallery.length]);

    useEffect(() => {
        
        async function getCarDetails(id){
            try{
                setLoading(true);
                setError(false);
                const data = await getCarById(id);
                setCarDetails(data);
                setLoading(false);
            }
            catch{
                setError(true);
            };
        }

        getCarDetails(id);
        setActiveImg(0);
    }, [id]);

    if (error) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "red", fontSize: "1.1rem" }}>⚠️ Failed to load car details.</p>
        </div>
    );

    if (loading || !carDetails) {
        return <CarDetailsSkeleton />;
    }

    const downPayment = carDetails.price * 0.2;
    const loanAmount = carDetails.price - downPayment;
    const monthlyEmi = Math.round((loanAmount * 1.09) / emiMonths);

    const specs = [
        { icon: "bi bi-lightning-charge-fill", label: "Body Type", value: carDetails.bodyType || "N/A" },
        { icon: "bi bi-fuel-pump-fill", label: "Fuel Type", value: carDetails.fuelType || "N/A" },
        { icon: "bi bi-gear-fill", label: "Transmission", value: carDetails.transmission || "N/A" },
        { icon: "bi bi-speedometer2", label: "Mileage", value: carDetails.mileage || "N/A" },
        { icon: "bi bi-tools", label: "Engine", value: carDetails.engineType || "N/A" },
        { icon: "bi bi-person-fill", label: "Seating", value: carDetails.seats ? carDetails.seats + " Seats" : "N/A" },
    ];

    const highlights = [
        "Advanced Safety Features",
        "Touchscreen Infotainment",
        "Rear Parking Camera",
        "Automatic Climate Control",
        "Keyless Entry & Push Start",
        "Cruise Control",
    ];

    return (
        <>
            <style>{`
            .cd-avail-badge {
                background: $ {
                  carDetails.available ? "#1db954": "#e63946"
                };
              }
            `}</style>

            <div className="cd-page">
                <div className="cd-breadcrumb">
                    <a onClick={() => navigate("/")}>Home</a> &nbsp;›&nbsp;
                    <a onClick={() => navigate("/vehicles")}>Vehicles</a> &nbsp;›&nbsp;
                    <span>{carDetails.brand} {carDetails.model}</span>
                </div>

                <div className="cd-header">
                    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <h1>{carDetails.brand} {carDetails.model}</h1>
                            <span className="cd-rating-badge">⭐ {carDetails.rating}</span>
                            <span className="cd-avail-badge">{carDetails.available ? "● IN STOCK" : "● OUT OF STOCK"}</span>
                        </div>
                        <p className="cd-subtitle">{carDetails.brand} · {carDetails.bodyType} · {carDetails.fuelType || "Petrol"}</p>
                    </div>
                </div>

                <div className="cd-body">
                    <div className="cd-gallery">
                        <img
                            src={gallery[activeImg] || carDetails.image}
                            alt={`${carDetails.brand} ${carDetails.model}`}
                            className="cd-main-img"
                            loading="lazy"
                            decoding="async"
                        />

                        <div className="cd-thumbs">
                            {gallery.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`${carDetails.brand} ${carDetails.model} view ${i + 1}`}
                                    className={`cd-thumb ${activeImg === i ? "active" : ""}`}
                                    onClick={() => setActiveImg(i)}
                                    loading="lazy"
                                    decoding="async"
                                />
                            ))}
                        </div>

                        <div className="cd-specs-card" style={{ marginTop: "16px" }}>
                            <div className="cd-section-title">Key Specifications</div>
                            <div className="cd-specs-grid">
                                {specs.map((s, i) => (
                                    <div key={i} className="cd-spec-item">
                                        <i className={s.icon}></i>
                                        <div className="cd-spec-label">{s.label}</div>
                                        <div className="cd-spec-value">{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cd-highlights-card" style={{ marginTop: "16px" }}>
                            <div className="cd-section-title">Key Highlights</div>
                            <div className="cd-highlights-grid">
                                {highlights.map((h, i) => (
                                    <div key={i} className="cd-highlight-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        {h}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="cd-right">
                        <div className="cd-price-card">
                            <div style={{ color: "#888", fontSize: "0.82rem", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Ex-Showroom Price
                            </div>
                            <div className="cd-price">₹ {carDetails.price?.toLocaleString("en-IN")}</div>
                            <div className="cd-price-sub">* Prices may vary. Contact dealer for on-road price.</div>

                            {user ? (
                                <div className="cd-cta-group">
                                    <button
                                        className="cd-btn-cart"
                                        onClick={() => isInCart(carDetails._id) ? removeFromCart(carDetails._id) : addToCart(carDetails._id)}
                                    >
                                        {isInCart(carDetails._id) ? "✓ Added to Cart" : "🛒 Add to Cart"}
                                    </button>
                                    <button
                                        className={`cd-btn-wish ${isInWishList(carDetails._id) ? "active" : ""}`}
                                        onClick={() => isInWishList(carDetails._id) ? removeFromWishList(carDetails._id) : addToWishList(carDetails)}
                                    >
                                        {isInWishList(carDetails._id) ? "❤️" : "🤍"}
                                    </button>
                                </div>
                            ) : (
                                <p style={{ marginTop: "14px", fontSize: "0.85rem", color: "#888" }}>
                                    <a style={{ color: "#1a1a2e", fontWeight: 600, cursor: "pointer" }} onClick={() => navigate("/login")}>
                                        Login
                                    </a>{" "}
                                    to add to cart or wishlist.
                                </p>
                            )}
                        </div>

                        <div className="cd-emi-card">
                            <div className="cd-section-title">EMI Calculator</div>
                            <div className="cd-emi-amount">
                                ₹ {monthlyEmi.toLocaleString("en-IN")}
                                <span style={{ fontSize: "1rem", color: "#aaa", fontWeight: 400 }}>/mo</span>
                            </div>
                            <div className="cd-emi-sub">Estimated EMI at 9% interest rate</div>

                            <input
                                type="range"
                                min="12"
                                max="84"
                                step="12"
                                value={emiMonths}
                                onChange={e => setEmiMonths(Number(e.target.value))}
                                className="cd-emi-slider"
                            />

                            <div className="cd-emi-labels">
                                <span>12 mo</span>
                                <span style={{ color: "#e8b500", fontWeight: 600 }}>{emiMonths} months</span>
                                <span>84 mo</span>
                            </div>

                            <div className="cd-emi-row">
                                <div>Down Payment (20%)<b>₹ {downPayment.toLocaleString("en-IN")}</b></div>
                                <div>Loan Amount<b>₹ {loanAmount.toLocaleString("en-IN")}</b></div>
                                <div>Tenure<b>{emiMonths} Months</b></div>
                            </div>
                        </div>

                        <div className="cd-specs-card">
                            <div className="cd-section-title">Overview</div>
                            <div className="cd-overview-wrap">
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                                    <tbody>
                                        {[
                                            ["Brand", carDetails.brand],
                                            ["Model", carDetails.model],
                                            ["Body Type", carDetails.bodyType || "N/A"],
                                            ["Fuel Type", carDetails.fuelType || "N/A"],
                                            ["Transmission", carDetails.transmission || "N/A"],
                                            ["Engine", carDetails.engineType || "N/A"],
                                            ["Mileage", carDetails.mileage || "N/A"],
                                            ["Seating", carDetails.seats ? carDetails.seats + " Seats" : "N/A"],
                                            ["Available", carDetails.available ? "Yes" : "No"],
                                        ].map(([label, val], i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                <td style={{ padding: "9px 8px", color: "#888", width: "45%" }}>{label}</td>
                                                <td style={{ padding: "9px 8px", fontWeight: 600, color: "#1a1a2e" }}>{val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CarDetailsPage;