import { useCart } from '../context/cart/useCart';
import { useEffect, useState } from 'react';
import CheckoutModal from '../component/CheckoutModal';
import { useNavigate } from 'react-router-dom';
import { CartListSkeleton, PageTitleSkeleton } from '../component/PageSkeletons';

function Cart() {
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState(null);

    const { cartItems: cart, removeFromCart, cartLoading, getCart } = useCart();
    const navigate = useNavigate();


    const openCheckout = (carId) => {   // ← NEW helper
        setSelectedCarId(carId);
        setShowCheckout(true);
    };

    const closeCheckout = () => {        // ← NEW helper
        setShowCheckout(false);
        setSelectedCarId(null);
    };

    useEffect(() => {
        getCart();
    },[])

    return (
        <div className="cart_page">
            {cartLoading
                ? <PageTitleSkeleton width="60px" />
                : <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: "white" }}>Cart</h2>
            }

            {cartLoading && <CartListSkeleton count={4} />}

            {!cartLoading && cart.length === 0 && (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                    <p style={{ fontSize: "1.2rem", color: "gray" }}>🛒 Your cart is empty!</p>
                </div>
            )}

            {!cartLoading && cart.length > 0 && (
                <div className="cart_layout">

                    <div className="cart_items_scroll">
                        {cart.map((item, index) => {
                            const car = item.carId;
                            if (!car) return null;

                            return (
                                <div key={index} className="cart-item">
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
                                        <b className="text" style={{ fontSize: "1rem" }}>{car.brand} {car.model}</b>
                                        <p style={{ margin: "2px 0", fontWeight: "lighter", fontSize: "0.85rem", color: "gray" }}>
                                            {car.bodyType}
                                            {car.transmission && ` • ${car.transmission}`}
                                            {car.fuelType && ` • ${car.fuelType}`}
                                        </p>
                                        <p className="text" style={{ margin: "2px 0", fontSize: "0.85rem" }}>⭐ {car.rating}</p>
                                        <b className="text" style={{ fontSize: "1rem" }}>₹{car.price?.toLocaleString('en-IN')}</b>
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex flex-column gap-2" style={{ flexShrink: 0 }}>
                                        <button className="btn btn-sm btn-remove" onClick={() => {removeFromCart(car._id)}}>
                                            Remove
                                        </button>

                                        {car.available > 0
                                            ? <button
                                                className="btn btn-sm cart_buy_btn btn-add"
                                                onClick={() => openCheckout(car._id)}>
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
                </div>
            )}

            {showCheckout && (
                <CheckoutModal
                    onClose={closeCheckout}
                    carId={selectedCarId}
                />
            )}
        </div>
    );
}

export default Cart;