import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../useFetch/useFetch";
import { useCart } from "../context/cart/useCart";
import { useWishList } from "../context/wish/useWishList";
import { useAuth } from "../context/auth/useAuth";
import { useState, useEffect } from "react";
import { CarGridSkeleton } from "../component/PageSkeletons";

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
        return (
            <div className="cart_page">
                <h2 style={{ padding: "5px", color: "var(--text)", backgroundColor: "white" }}>Car Details</h2>
                <CarGridSkeleton count={5} />
            </div>
        );
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
                .cd-page { font-family: 'Barlow', sans-serif; background: #f4f4f4; width: 100%; min-height: calc(100vh - 54px); height: calc(100vh - 54px); overflow-y: auto; }
                .cd-breadcrumb { background: #1a1a2e; padding: 12px 24px; color: #aaa; font-size: 0.82rem; letter-spacing: 0.5px; }
                .cd-breadcrumb span { color: #fff; }
                .cd-breadcrumb a { color: #aaa; text-decoration: none; cursor: pointer; }
                .cd-breadcrumb a:hover { color: #fff; }

                .cd-header { background: #1a1a2e; padding: 20px 24px 24px; color: white; }
                .cd-header h1 { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 700; margin: 0; letter-spacing: 1px; text-transform: uppercase; }
                .cd-header .cd-subtitle { color: #aaa; font-size: 0.9rem; margin-top: 4px; }
                .cd-rating-badge { background: #e8b500; color: #1a1a2e; font-weight: 700; padding: 3px 10px; border-radius: 4px; font-size: 0.85rem; }
                .cd-avail-badge { background: ${car.available ? "#1db954" : "#e63946"}; color: white; font-size: 0.78rem; font-weight: 600; padding: 3px 10px; border-radius: 4px; letter-spacing: 0.5px; }

                .cd-body { max-width: 1200px; margin: 0 auto; padding: 24px 16px; display: flex; gap: 24px; align-items: flex-start; }
                @media (max-width: 1024px) { .cd-body { flex-direction: column; } }

                .cd-gallery { flex: 1.4; position: sticky; top: 20px; }
                .cd-main-img { width: 100%; height: 360px; object-fit: cover; border-radius: 12px; background: white; box-shadow: 0 4px 24px rgba(0,0,0,0.12); transition: all 0.3s; }
                .cd-thumbs { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
                .cd-thumb { width: 80px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: border 0.2s; opacity: 0.6; }
                .cd-thumb.active { border-color: #1a1a2e; opacity: 1; }
                .cd-thumb:hover { opacity: 1; }

                .cd-right { flex: 1; display: flex; flex-direction: column; gap: 16px; }

                .cd-price-card { background: white; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
                .cd-price { font-family: 'Barlow Condensed', sans-serif; font-size: 2.4rem; font-weight: 700; color: #1a1a2e; }
                .cd-price-sub { color: #888; font-size: 0.8rem; margin-top: 2px; }
                .cd-cta-group { display: flex; gap: 10px; margin-top: 16px; }
                .cd-btn-cart { flex: 1; padding: 12px; background: #1a1a2e; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; }
                .cd-btn-cart:hover { background: #2d2d5e; }
                .cd-btn-wish { padding: 12px 16px; border: 2px solid #e63946; color: #e63946; background: white; border-radius: 8px; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; }
                .cd-btn-wish:hover, .cd-btn-wish.active { background: #e63946; color: white; }

                .cd-specs-card { background: white; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
                .cd-section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.15rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1a1a2e; margin-bottom: 16px; border-left: 4px solid #e8b500; padding-left: 10px; }
                .cd-specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                @media (max-width: 1024px) { .cd-specs-grid { grid-template-columns: repeat(2, 1fr); } }
                .cd-spec-item { background: #f8f8f8; border-radius: 8px; padding: 12px; text-align: center; }
                .cd-spec-item i { font-size: 1.4rem; color: #1a1a2e; }
                .cd-spec-label { font-size: 0.72rem; color: #999; margin: 4px 0 2px; text-transform: uppercase; letter-spacing: 0.5px; }
                .cd-spec-value { font-size: 0.88rem; font-weight: 600; color: #1a1a2e; }

                .cd-highlights-card { background: white; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
                .cd-highlights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .cd-highlight-item { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #333; }
                .cd-highlight-item i { color: #1db954; font-size: 1rem; flex-shrink: 0; }

                .cd-emi-card { background: #1a1a2e; border-radius: 12px; padding: 20px 24px; color: white; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
                .cd-emi-card .cd-section-title { color: #e8b500; border-left-color: #e8b500; }
                .cd-emi-amount { font-family: 'Barlow Condensed', sans-serif; font-size: 2rem; font-weight: 700; color: #e8b500; }
                .cd-emi-sub { font-size: 0.8rem; color: #aaa; margin-top: 2px; }
                .cd-emi-slider { width: 100%; accent-color: #e8b500; margin: 12px 0 4px; }
                .cd-emi-labels { display: flex; justify-content: space-between; font-size: 0.78rem; color: #aaa; }
                .cd-emi-row { display: flex; justify-content: space-between; margin-top: 14px; padding-top: 14px; border-top: 1px solid #333; gap: 12px; }
                .cd-emi-row div { font-size: 0.82rem; color: #aaa; }
                .cd-emi-row b { display: block; color: white; font-size: 0.95rem; margin-top: 2px; }
                .cd-overview-wrap { overflow-x: auto; }

                @media (max-width: 1024px) {
                    .cd-body {
                        max-width: 100%;
                        padding: 18px 14px;
                        align-items: stretch;
                    }
                    .cd-gallery,
                    .cd-right {
                        width: 100%;
                    }
                    .cd-gallery { position: static; }
                    .cd-main-img { height: 320px; }
                }

                @media (max-width: 768px) {
                    .cd-breadcrumb { padding: 10px 12px; font-size: 0.75rem; }
                    .cd-header { padding: 16px 12px 18px; }
                    .cd-header h1 { font-size: 1.55rem; letter-spacing: 0.5px; }
                    .cd-header .cd-subtitle { font-size: 0.78rem; }
                    .cd-body { padding: 12px 10px 16px; gap: 14px; }
                    .cd-main-img { height: 230px; border-radius: 10px; }
                    .cd-thumbs { gap: 8px; margin-top: 10px; }
                    .cd-thumb { width: 62px; height: 46px; border-radius: 6px; }
                    .cd-price-card, .cd-specs-card, .cd-highlights-card, .cd-emi-card { padding: 14px; border-radius: 10px; }
                    .cd-price { font-size: 1.85rem; }
                    .cd-cta-group { flex-direction: column; }
                    .cd-btn-cart, .cd-btn-wish { width: 100%; }
                    .cd-highlights-grid { grid-template-columns: 1fr; }
                    .cd-emi-row { flex-direction: column; gap: 8px; }
                    .cd-overview-wrap table { min-width: 420px; }
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