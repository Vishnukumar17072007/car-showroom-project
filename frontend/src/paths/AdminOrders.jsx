import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { OrderListSkeleton } from '../component/PageSkeletons';
import { useAuth } from '../context/auth/useAuth';

const statusColor = (status) => {
    switch (status) {
        case 'confirmed': return '#2ecc71';
        case 'delivered': return '#3498db';
        case 'cancelled': return '#e74c3c';
        default:          return '#f39c12';
    }
};

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    async function fetchAllOrders() {
        try {
            const res = await API.get('/order/admin/all');
            setOrders(res.data);
        } catch {
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user?.role === "admin"){
            fetchAllOrders();
        }
        else{
            setLoading(false);
        }
    }, [user]);

    async function handleStatusChange(orderId, newStatus) {
        try {
            await API.put(`/order/admin/${orderId}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            fetchAllOrders(); // re-sync
        } catch {
            toast.error("Failed to update status.");
        }
    }

    if (loading) {
        return (
            <div className="cart_page">
                <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: 'white' }}>
                    All Orders (Admin)
                </h2>
                <OrderListSkeleton count={5} />
            </div>
        );
    }

    return (
        <div className="cart_page">
            <div className="cart_layout">
                <div className="cart_items_scroll">
                    <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: 'white' }}>
                        All Orders (Admin)
                    </h2>

                    {orders.length === 0 ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                            <p style={{ fontSize: '1.2rem', color: 'gray' }}>No orders placed yet.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="cart_item_card" style={{ width: '100%' }}>

                                {/* Order header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div>
                                        {/* ✅ shows which user placed this order */}
                                        <p style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                                            {order.userId?.name || 'Unknown User'}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--subtext)', margin: 0 }}>
                                            {order.userId?.email}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '13px', color: 'var(--subtext)' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                        {/* ✅ status dropdown for admin */}
                                        <select
                                            value={order.status}
                                            onChange={e => handleStatusChange(order._id, e.target.value)}
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                border: `1px solid ${statusColor(order.status)}`,
                                                backgroundColor: statusColor(order.status) + '22',
                                                color: statusColor(order.status),
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Cars in this order */}
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
                                        <img
                                            src={item.carId?.image}
                                            alt={item.carId?.brand}
                                            style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                                                {item.carId?.brand} {item.carId?.model}
                                            </p>
                                            <p style={{ color: 'var(--subtext)', fontSize: '13px', margin: 0 }}>
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
                                    marginTop: '4px'
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
}

export default AdminOrders;