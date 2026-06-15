import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { useWishList } from "../context/wish/useWishList";
import { useCart } from "../context/cart/useCart";
import { useOrder } from "../context/order/useOrder";
import SubscriptionModal from "../component/SubscriptionModal";

function Profile() {

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const navigate = useNavigate();

    const { user, logout, checkAuth } = useAuth();
    const { wishListItems, getWishList } = useWishList();
    const { cartItems,getCart } = useCart();
    const { orders, getOrders } = useOrder();

    const wishListCount = wishListItems.length;
    const cartListCount = cartItems.length;
    const orderCount = orders.length;

    useEffect(() => {
        checkAuth();
        getWishList();
        getOrders();
        getCart();
    },[]);

    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "N/A";

    return (
        <>
            <div className="profile-scroll-area">
                <div className="profile">
                    <div className="profile-details-card">
                        <div className="profile-photo-wrapper">
                            {user.image
                                ? <img className="img-round" src={user.image} />
                                : <i className="bi bi-person-circle profile-avatar-icon"></i>
                            }
                        </div>

                        <div className="name-subscription">
                            <div className="name">
                                <h3>{user.userName}</h3>
                            </div>
                            <div className="status">
                                <i className={`user-role ${user.role === "admin" ? "bi bi-shield-check" : "bi bi-shield"}`}>
                                    {" "}{user.role}
                                </i>
                                <i className={`subscription-badge ${
                                    user.subscription === "free"    ? "bi bi-stars" :
                                    user.subscription === "pro"     ? "bi bi-star-half" :
                                    user.subscription === "premium" ? "bi bi-star-fill" : ""
                                }`}>
                                    {" "}{user.subscription}
                                </i>
                            </div>
                        </div>

                        <i className="bi bi-box-arrow-right logout-btn" onClick={() => {logout()}}>
                            {" "}Logout
                        </i>

                    </div>

                    {user.subscription !== "premium" && (
                        <div className="plan-upgrade-recommendation">
                            <p>
                                <i className="bi bi-crown"></i>
                                {" "}You're on the <strong>{user.subscription === "free" ? "Free" : "Pro"}</strong> plan. Upgrade for priority listings.
                            </p>
                            <p className="upgrade-link" onClick={() => setShowSubscriptionModal(true)}>
                                Upgrade <span className="bi bi-arrow-right"></span>
                            </p>
                        </div>
                    )}

                    <div className="profile-bottom-grid">
                        <div className="activity-overview">
                            <div className="activity-block divider" onClick={() => navigate("/wishlist")}>
                                <i className="bi bi-heart"></i>
                                <strong className="count">{wishListCount}</strong>
                                <p>WISHLIST</p>
                            </div>
                            <div className="activity-block divider" onClick={() => navigate("/cartList")}>
                                <i className="bi bi-cart3"></i>
                                <strong className="count">{cartListCount}</strong>
                                <p>CART</p>
                            </div>
                            <div className="activity-block divider" onClick={() => navigate("/orders")}>
                                <i className="bi bi-box-seam"></i>
                                <strong className="count">{orderCount}</strong>
                                <p>ORDERS</p>
                            </div>
                        </div>

                        <div className="account-details">
                            <div className="detail-row divider">
                                <p className="detail-label"><i className="bi bi-envelope"></i> Email</p>
                                <p className="detail-value">{user?.email}</p>
                            </div>
                            <div className="detail-row divider">
                                <p className="detail-label"><i className="bi bi-telephone"></i> Phone</p>
                                <p className="detail-value">{user.phone}</p>
                            </div>
                            <div className="detail-row detail-label"><i className="bi bi-geo-alt"></i>Address</div>
                            <div className="detail-modal divider">
                                <div className="detail-row divider">
                                    <p className="detail-label">Address</p>
                                    <p className="detail-value">{user.location?.address}</p>
                                </div>
                                <div className="detail-row divider">
                                    <p className="detail-label">City</p>
                                    <p className="detail-value">{user.location?.city}</p>
                                </div>
                                <div className="detail-row divider">
                                    <p className="detail-label">State</p>
                                    <p className="detail-value">{user.location?.state}</p>
                                </div>
                                <div className="detail-row divider">
                                    <p className="detail-label">Pincode</p>
                                    <p className="detail-value">{user.location?.pincode}</p>
                                </div>
                            </div>
                            <div className="detail-row divider">
                                <p className="detail-label"><i className="bi bi-shield"></i> Role</p>
                                <p className="detail-value">{user.role}</p>
                            </div>
                            <div className="detail-row divider">
                                <p className="detail-label"><i className="bi bi-stars"></i> Subscription</p>
                                <p className="detail-value">{user.subscription}</p>
                            </div>
                            <div className="detail-row">
                                <p className="detail-label"><i className="bi bi-calendar-event"></i> Joined</p>
                                <p className="detail-value">{joinedDate}</p>
                            </div>
                        </div>
                    </div>

                    <button className="edit-profile-btn" onClick={() => navigate("/editProfile")}>
                        <i className="bi bi-pencil-square"></i> Edit Profile
                    </button>

                </div>

                {showSubscriptionModal && (
                    <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
                )}
            </div>
        </>
    );
}

export default Profile;