import { useCart } from '../context/cart/useCart';
import { useState } from 'react';
import CheckoutModal from '../component/CheckoutModal';
import { useNavigate } from 'react-router-dom';
import { CartListSkeleton } from '../component/PageSkeletons';

function Cart() {
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedCarIds, setSelectedCarIds] = useState(null);

    const { cartItems: cart, removeFromCart, cartLoading } = useCart();
    const navigate = useNavigate();

    const totalPrice = cart.reduce((sum, item) => sum + Number(item.carId?.price || 0), 0);

    const openCheckout = (carIds) => {   // ← NEW helper
        setSelectedCarIds(carIds);
        setShowCheckout(true);
    };

    const closeCheckout = () => {        // ← NEW helper
        setShowCheckout(false);
        setSelectedCarIds(null);
    };

    const hasUnavailable = cart.some(item => item.carId && (item.carId.available ?? 0) <= 0);
    return (
        <div className="cart_page">
            <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: "white" }}>
                Cart 
            </h2>

            {cartLoading && <CartListSkeleton count={4} />}

            {!cartLoading && cart.length === 0 && (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                    <p style={{ fontSize: "1.2rem", color: "gray" }}>🛒 Your cart is empty!</p>
                </div>
            )}

            {!cartLoading && cart.length > 0 && (
                <div className="cart_layout d-flex gap-3 align-items-start">

                    {/* LEFT — cart items list (scrollable) */}
                    <div className="cart_items_scroll d-flex flex-column gap-3">
                        {cart.map((item, index) => {
                            const car = item.carId;   //takes one car details at a time
                            if (!car) return null;

                            return (
                                <div key={index} className="d-flex gap-3 p-3" style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    background: "var(--card-bg, #141414)",
                                    borderRadius: "10px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    alignItems: "center"
                                }}>
                                    {/* Image */}
                                    <div style={{
                                        width: "140px", height: "90px", flexShrink: 0,
                                        borderRadius: "8px", overflow: "hidden", background: "#f0f0f0"
                                    }}>
                                        <img
                                            src={car.image}
                                            alt={car.model}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                                            onClick={() => navigate(`/vehicles/${car._id}`)}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div style={{ flex: 1 }}>
                                        <b style={{ fontSize: "1rem", color: "white"}}>{car.brand} {car.model}</b>
                                        <p style={{ margin: "2px 0", fontWeight: "lighter", fontSize: "0.85rem", color: "gray" }}>
                                            {car.bodyType}
                                            {car.transmission && ` • ${car.transmission}`}
                                            {car.fuelType && ` • ${car.fuelType}`}
                                        </p>
                                        <p style={{ margin: "2px 0", fontSize: "0.85rem", color: "white" }}>⭐ {car.rating}</p>
                                        <b style={{ fontSize: "1rem", color: "white" }}>₹{car.price?.toLocaleString('en-IN')}</b>
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex flex-column gap-2" style={{ flexShrink: 0 }}>
                                        <button className="btn btn-sm btn-remove" onClick={() => {removeFromCart(car._id)}}>
                                            Remove
                                        </button>

                                        {car.available > 0
                                            ? <button
                                                className="btn btn-sm cart_buy_btn btn-add"
                                                onClick={() => openCheckout([car._id])}>
                                                Buy
                                            </button>
                                            : <button className="btn btn-sm" disabled
                                                style={{ background: "#ccc", color: "#666", cursor: "not-allowed" }}>
                                                Not Available
                                            </button>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT — order summary */}
                    <div style={{
                        width: "280px",
                        flexShrink: 0,
                        background: "var(--card-bg, #141414)",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        padding: "20px"
                    }}>
                        <h6 className="mb-3" style={{color: "white"}}>Order Summary</h6>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                            <span style={{ color: "gray" }}>Total Items</span>
                            <span style={{color: "white"}}>{cart.length}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span style={{ color: "gray" }}>Total Price</span>
                            <b style={{color: "white"}}>₹{totalPrice.toLocaleString('en-IN')}</b>
                        </div>
                        <hr />
                        <button
                            className="btn btn-success w-100"
                            onClick={() => openCheckout( cart.map( item => item?.carId?._id || item?.carId ))}
                            disabled={hasUnavailable}
                            title={hasUnavailable ? "Remove unavailable cars from cart to proceed" : ""}
                        >
                            Buy All
                        </button>
                        {hasUnavailable && (
                            <p style={{ fontSize: "0.75rem", color: "#e74c3c", marginTop: "6px", textAlign: "center" }}>
                                Remove unavailable cars from cart to enable Buy All.
                            </p>
                        )}
                    </div>

                </div>
            )}

            {showCheckout && (
                <CheckoutModal
                    onClose={closeCheckout}
                    carIds={selectedCarIds}   // ← FIXED: pass selected IDs
                />
            )}
        </div>
    );
}

export default Cart;