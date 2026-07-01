import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { OrderListSkeleton, PageTitleSkeleton } from '../component/PageSkeletons';
import { useAuth } from '../context/auth/useAuth';
import { useOrder } from '../context/order/useOrder';

// ─────────────────────────────────────────────
// Shared helper
// ─────────────────────────────────────────────
const statusColor = (status) => {
  switch (status) {
    case 'in_progress': return '#f3be17';
    case 'approved':    return '#2ecc71';
    case 'delivered':   return '#3498db';
    case 'cancelled':   return '#e74c3c';
    case 'rejected':    return '#e74c3c';
    default:            return '#f39c12';
  }
};

// ─────────────────────────────────────────────
// Admin View
// ─────────────────────────────────────────────
function AdminOrders() {
  const {orders, ordersLoading, fetchOrders, changeStatus} = useOrder();

  useEffect(() => { fetchOrders(); }, []);


  async function handleStatusChange(orderId, newStatus) {
    try {
      await changeStatus(orderId, newStatus);
    } catch {
      toast.error('Failed to update status.');
    }
  }

  if (ordersLoading) {
    return (
      <div className="cart_page">
        <PageTitleSkeleton width="80px" />
        <OrderListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="cart_page">
      <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: 'white' }}>
            Orders
          </h2>
      <div className="cart_layout">
        <div className="cart_items_scroll">
          {orders.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <p style={{ fontSize: '1.2rem', color: 'gray' }}>No orders placed yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="cart_item_card" style={{ width: '100%', padding: "0px 20px 0px 20px" }}>

                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                      {order.userId?.userName || 'Unknown User'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--subtext)', margin: 0 }}>
                      {order.userId?.email}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--subtext)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>

                    {order.status === 'cancelled' ? (
                      <div style={{
                        fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                        borderRadius: '20px', border: `1px solid ${statusColor(order.status)}`,
                        backgroundColor: statusColor(order.status) + '22',
                        color: statusColor(order.status),
                      }}>
                        Cancelled
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          fontSize: '12px', fontWeight: 600, padding: '4px 10px',
                          borderRadius: '20px', border: `1px solid ${statusColor(order.status)}`,
                          backgroundColor: statusColor(order.status) + '22',
                          color: statusColor(order.status), cursor: 'pointer',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="approved">Approved</option>
                        <option value="delivered">Delivered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    )}
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
                        ₹{order.price}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Order footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                  marginTop: '4px', paddingBottom: '10px', marginBottom: '4px',
                }}>
                  <span style={{ color: 'var(--subtext)', fontSize: '13px' }}>
                    Deliver to: {order.shippingDetails?.name}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                    Total: ₹{order.price?.toLocaleString('en-IN')}
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

// ─────────────────────────────────────────────
// User View
// ─────────────────────────────────────────────
function UserOrders() {
  const navigate = useNavigate();
  const { orders, cancelOrder, deleteOrder, ordersLoading, fetchOrders } = useOrder();
  const [openOrderMenu, setOpenOrderMenu] = useState(null);

  const activeOrders = orders
    .filter((i) => ['pending', 'approved', 'in_progress'].includes(i.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const historyOrders = orders
    .filter((i) => ['cancelled', 'delivered', 'rejected'].includes(i.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
    } catch (err) {
      toast.error(err.message || 'Could not cancel order.');
    }
  };

  const OrderCard = ({ order }) => (
    <div className="cart_item_card" style={{ width: '100%', position: 'relative' }}>

      {/* Order header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--subtext)' }}>
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '12px', fontWeight: 600, padding: '4px 12px',
            borderRadius: '20px', backgroundColor: statusColor(order.status) + '22',
            color: statusColor(order.status), textTransform: 'capitalize',
          }}>
            {order.status}
          </span>

          {order.status === 'pending' && (
            <button
              onClick={() => handleCancel(order._id)}
              style={{
                fontSize: '12px', fontWeight: 600, padding: '4px 12px',
                borderRadius: '20px', border: '1px solid #e74c3c',
                backgroundColor: 'transparent', color: '#e74c3c', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}

          <div style={{ position: 'relative' }}>
            <i
              className="bi bi-three-dots-vertical threeDots"
              onClick={() => setOpenOrderMenu(openOrderMenu === order._id ? null : order._id)}
            />
            {openOrderMenu === order._id && (
              <div className="orderMenubox">
                <li className="orderMenu" onClick={() => navigate('/support')}>Support</li>
                {(order.status === 'cancelled' || order.status === 'rejected') && !order.deletedByUser && (
                  <li
                    className="orderMenu"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteOrder(order._id);
                      setOpenOrderMenu(null);
                    }}
                  >
                    Delete history
                  </li>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cars in this order */}
      {order.items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px' }}>
          <img
            src={item.carId?.image}
            alt={item.carId?.brand}
            style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white' }}
            onClick={() => navigate(`/vehicles/${item.carId._id}`)}
          />
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text)' }}>{item.carId?.brand} {item.carId?.model}</p>
            <p style={{ color: 'var(--subtext)', fontSize: '13px' }}>₹{item.carId?.price?.toLocaleString('en-IN')}</p>
          </div>
        </div>
      ))}

      {/* Order footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '10px',
      }}>
        <span style={{ color: 'var(--subtext)', fontSize: '13px' }}>
          Deliver to: {order.shippingDetails?.name}
        </span>
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>
          Total: ₹{order.price?.toLocaleString('en-IN')}
        </span>
      </div>

    </div>
  );

  return (
    <div className="cart_page">
      {ordersLoading
        ? <PageTitleSkeleton width="80px" />
        : <h2 style={{ padding: '5px', color: 'var(--text)', backgroundColor: 'white' }}>Orders</h2>
      }
      <div className="cart_layout">
        <div className="cart_items_scroll">

          {ordersLoading ? (
            <OrderListSkeleton count={4} />
          ) : activeOrders.length === 0 && historyOrders.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <p style={{ fontSize: '1.2rem', color: 'gray' }}>No Orders have been placed.</p>
            </div>
          ) : (
            <>
              {activeOrders.map((order) => <OrderCard key={order._id} order={order} />)}

              {historyOrders.length > 0 && (
                <>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0 8px 0', gridColumn: '1 / -1'}}>
                    <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--subtext)', whiteSpace: 'nowrap' }}>
                      Order History
                    </span>
                    <hr style={{ flex: 1, borderColor: 'var(--border)' }} />
                  </div>
                  {historyOrders.map((order) => <OrderCard key={order._id} order={order} />)}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminOrders /> : <UserOrders />;
}