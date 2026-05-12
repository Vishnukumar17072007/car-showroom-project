import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/order/orderContext';
import { OrderListSkeleton } from '../component/PageSkeletons';

const Orders = () => {

    const navigate = useNavigate();

    const { orders, cancelOrder, ordersLoading } = useContext(OrderContext);  // ← pull cancelOrder

    const statusColor = (status) => {
        switch (status) {
            case 'confirmed':  return '#2ecc71';
            case 'delivered':  return '#3498db';
            case 'cancelled':  return '#e74c3c';
            default:           return '#f39c12';
        }
    };

    const handleCancel = async (orderId) => {
        try {
            await cancelOrder(orderId);
        } catch (err) {
            toast.error(err.message || 'Could not cancel order.');
        }
    };

    return (
        <div className="cart_page">
            <div className="cart_layout">
                <div className="cart_items_scroll">
                    <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: "white" }}>
                        My Orders 
                    </h2>

                    {ordersLoading ? (
                        <OrderListSkeleton count={4} />
                    ) : orders.length === 0 ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                            <p style={{ fontSize: "1.2rem", color: "gray" }}>No Orders have been placed.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="cart_item_card" style={{ width: '100%' }}>

                                {/* Order header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{ fontSize: '13px', color: 'var(--subtext)' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>

                                    {/* Status badge + Cancel button side by side */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            backgroundColor: statusColor(order.status) + '22',
                                            color: statusColor(order.status),
                                            textTransform: 'capitalize'
                                        }}>
                                            {order.status}
                                        </span>

                                        {/* ↓ NEW — only shows for pending orders */}
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(order._id)}
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    border: '1px solid #e74c3c',
                                                    backgroundColor: 'transparent',
                                                    color: '#e74c3c',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Cars in this order */}
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'center',
                                        marginBottom: '10px'
                                    }}>
                                        <img
                                            src={item.carId?.image}
                                            alt={item.carId?.brand}
                                            style={{
                                                width: '100px',
                                                height: '65px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                cursor: "pointer",
                                                backgroundColor: "white"
                                            }}
                                            onClick={() => navigate(`/vehicles/${item.carId._id}`)}
                                        />
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'var(--text)' }}>
                                                {item.carId?.brand} {item.carId?.model}
                                            </p>
                                            <p style={{ color: 'var(--subtext)', fontSize: '13px' }}>
                                                ₹{item.carId?.price?.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Order footer */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid var(--border)',
                                    paddingTop: '10px',
                                    marginTop: '4px',
                                    marginBottom: '10px',
                                }}>
                                    <span style={{ color: 'var(--subtext)', fontSize: '13px' }}>
                                        Deliver to: {order.shippingDetails?.name}
                                    </span>
                                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                                        Total: ₹{order.totalPrice?.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;