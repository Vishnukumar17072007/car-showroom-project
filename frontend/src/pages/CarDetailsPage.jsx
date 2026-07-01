import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../useFetch/useFetch";
import { useCart } from "../context/cart/useCart";
import { useWishList } from "../context/wish/useWishList";
import { useAuth } from "../context/auth/useAuth";
import { useState, useEffect } from "react";
import { CarDetailsSkeleton } from "../components/PageSkeletons";

function CarDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, removeFromCart, isInCart } = useCart();
    const { addToWishList, removeFromWishList, isInWishList } = useWishList();
    const [activeImg, setActiveImg] = useState(0);
    const [emiMonths, setEmiMonths] = useState(36);

    const url = `${import.meta.env.VITE_API_URL}/cars/${id}`;
    const [car, error, loading] = useFetch(url);

    const gallery = [
        car?.frontImage,
        car?.leftSideImage,
        car?.rightSideImage,
        car?.rearImage,
        car?.image
    ].filter(Boolean);

    useEffect(() => {
        if (!gallery.length) return;

        const interval = setInterval(() => {
            setActiveImg((prev) => (prev + 1) % gallery.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [gallery.length]);

    useEffect(() => {
        setActiveImg(0);
    }, [id]);

    if (error) return (
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "red", fontSize: "1.1rem" }}>⚠️ Failed to load car details.</p>
        </div>
    );

    if (loading || !car) {
        return <CarDetailsSkeleton />;
    }

    const downPayment = car.price * 0.2;
    const loanAmount = car.price - downPayment;
    const monthlyEmi = Math.round((loanAmount * 1.09) / emiMonths);

    const specs = [
        { icon: "bi bi-lightning-charge-fill", label: "Body Type", value: car.bodyType || "N/A" },
        { icon: "bi bi-fuel-pump-fill", label: "Fuel Type", value: car.fuelType || "N/A" },
        { icon: "bi bi-gear-fill", label: "Transmission", value: car.transmission || "N/A" },
        { icon: "bi bi-speedometer2", label: "Mileage", value: car.mileage || "N/A" },
        { icon: "bi bi-tools", label: "Engine", value: car.engineType || "N/A" },
        { icon: "bi bi-person-fill", label: "Seating", value: car.seats ? car.seats + " Seats" : "N/A" },
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
                  car.available ? "#1db954": "#e63946"
                };
              }
            `}</style>

            <div className="cd-page">
                <div className="cd-breadcrumb">
                    <a onClick={() => navigate("/")}>Home</a> &nbsp;›&nbsp;
                    <a onClick={() => navigate("/vehicles")}>Vehicles</a> &nbsp;›&nbsp;
                    <span>{car.brand} {car.model}</span>
                </div>

                <div className="cd-header">
                    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <h1>{car.brand} {car.model}</h1>
                            <span className="cd-rating-badge">⭐ {car.rating}</span>
                            <span className="cd-avail-badge">{car.available ? "● IN STOCK" : "● OUT OF STOCK"}</span>
                        </div>
                        <p className="cd-subtitle">{car.brand} · {car.bodyType} · {car.fuelType || "Petrol"}</p>
                    </div>
                </div>

                <div className="cd-body">
                    <div className="cd-gallery">
                        <img
                            src={gallery[activeImg] || car.image}
                            alt={`${car.brand} ${car.model}`}
                            className="cd-main-img"
                            loading="lazy"
                            decoding="async"
                        />

                        <div className="cd-thumbs">
                            {gallery.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`${car.brand} ${car.model} view ${i + 1}`}
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
                            <div className="cd-price">₹ {car.price?.toLocaleString("en-IN")}</div>
                            <div className="cd-price-sub">* Prices may vary. Contact dealer for on-road price.</div>

                            {user ? (
                                <div className="cd-cta-group">
                                    <button
                                        className="cd-btn-cart"
                                        onClick={() => isInCart(car._id) ? removeFromCart(car._id) : addToCart(car._id)}
                                    >
                                        {isInCart(car._id) ? "✓ Added to Cart" : "🛒 Add to Cart"}
                                    </button>
                                    <button
                                        className={`cd-btn-wish ${isInWishList(car._id) ? "active" : ""}`}
                                        onClick={() => isInWishList(car._id) ? removeFromWishList(car._id) : addToWishList(car)}
                                    >
                                        {isInWishList(car._id) ? "❤️" : "🤍"}
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
                                            ["Brand", car.brand],
                                            ["Model", car.model],
                                            ["Body Type", car.bodyType || "N/A"],
                                            ["Fuel Type", car.fuelType || "N/A"],
                                            ["Transmission", car.transmission || "N/A"],
                                            ["Engine", car.engineType || "N/A"],
                                            ["Mileage", car.mileage || "N/A"],
                                            ["Seating", car.seats ? car.seats + " Seats" : "N/A"],
                                            ["Available", car.available ? "Yes" : "No"],
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