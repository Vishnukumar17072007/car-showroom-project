import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

/* ── helpers ────────────────────────────────────────────────────── */
function fmtRupees(n) {
  if (!n) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const STATUS_COLORS = {
  delivered: "#3db87a",
  pending: "#f39c12",
  confirmed: "#3b82f6",
  cancelled: "#e05252",
};

const STATUS_LABEL = {
  delivered: "Delivered",
  pending: "Processing",
  confirmed: "Shipped",
  cancelled: "Cancelled",
};

/* ── stat card ──────────────────────────────────────────────────── */
function StatCard({ icon, iconBg, iconColor, label, value, sub, onClick }) {
  return (
    <div className="db-stat-card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="db-stat-icon" style={{ background: iconBg, color: iconColor }}>
        <i className={icon} />
      </div>
      <div className="db-stat-body">
        <p className="db-stat-label">{label}</p>
        <h2 className="db-stat-value">{value}</h2>
        <p className="db-stat-sub">{sub}</p>
      </div>
    </div>
  );
}

/* ── custom tooltip ─────────────────────────────────────────────── */
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#16161c", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
    }}>
      <p style={{ color: "#a09da8", margin: "0 0 4px" }}>{label}</p>
      <p style={{ color: "#c9a84c", margin: 0, fontWeight: 600 }}>
        {fmtRupees(payload[0].value)}
      </p>
    </div>
  );
}

/* ── custom legend ──────────────────────────────────────────────── */
function CustomLegend({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
      {data.map((d) => (
        <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: d.fill, flexShrink: 0, display: "inline-block" }} />
          <span style={{ color: "#a09da8" }}>{STATUS_LABEL[d.name] ?? d.name}</span>
          <span style={{ marginLeft: "auto", paddingLeft: 24, color: d.fill, fontWeight: 600 }}>
            {d.value} ({d.pct}%)
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────── */
export default function UserDashboard() {
  const navigate = useNavigate();

  // ── state ──
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [spendingOverTime, setSpendingOverTime] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── fetch all dashboard data on mount ──
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          wishlistRes,
          cartRes,
          orderStatsRes,
          spendingRes,
          statusRes,
          historyRes,
        ] = await Promise.all([
          apiGet("/dashboard/wishlist-count"),
          apiGet("/dashboard/cart-count"),
          apiGet("/dashboard/order-stats"),
          apiGet("/dashboard/spending-over-time"),
          apiGet("/dashboard/order-status"),
          apiGet("/dashboard/order-history"),
        ]);

        setWishlistCount(wishlistRes.count ?? 0);
        setCartCount(cartRes.count ?? 0);
        setTotalOrders(orderStatsRes.totalOrders ?? 0);
        setTotalSpent(orderStatsRes.totalSpent ?? 0);
        setSpendingOverTime(spendingRes.spendingOverTime ?? []);
        setOrderStatus(statusRes.orderStatus ?? []);
        setOrderHistory(historyRes.orders ?? []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ── status pie data ──
  const statusData = useMemo(() => {
    return orderStatus.map((s) => ({
      name: s._id,
      value: s.count,
      fill: STATUS_COLORS[s._id] ?? "#c9a84c",
      pct: totalOrders ? Math.round((s.count / totalOrders) * 100) : 0,
    }));
  }, [orderStatus, totalOrders]);

  // ── spending chart data (format month name) ──
  const monthlyData = useMemo(() => {
    return spendingOverTime.map((s) => ({
      month: new Date(s._id.year, s._id.month - 1).toLocaleString("en-IN", { month: "short" }),
      spending: s.total,
    }));
  }, [spendingOverTime]);

  // ── short order id ──
  const shortId = (id) => `#CF${id?.slice(-4).toUpperCase() ?? "----"}`;

  if (loading) {
    return <div className="db-empty">Loading dashboard...</div>;
  }

  return (
    <div className="db-page">
      {/* ── Header ── */}
      <div className="db-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your activity on CarField</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="db-stats-row">
        <StatCard
          icon="bi bi-heart-fill"
          iconBg="rgba(224,82,82,0.15)"
          iconColor="#e05252"
          label="Wishlist"
          value={wishlistCount}
          sub="Cars in wishlist"
          onClick={() => navigate("/wishlist")}
        />
        <StatCard
          icon="bi bi-cart-fill"
          iconBg="rgba(55,138,221,0.15)"
          iconColor="#378ADD"
          label="Cart List"
          value={cartCount}
          sub="Cars in cart"
          onClick={() => navigate("/cartList")}
        />
        <StatCard
          icon="bi bi-bag-check-fill"
          iconBg="rgba(29,158,117,0.15)"
          iconColor="#1D9E75"
          label="Total Orders"
          value={totalOrders}
          sub="Orders placed"
          onClick={() => navigate("/orders")}
        />
        <StatCard
          icon="bi bi-currency-rupee"
          iconBg="rgba(127,119,221,0.15)"
          iconColor="#7F77DD"
          label="Total Spent"
          value={fmtRupees(totalSpent)}
          sub="Total amount spent"
        />
      </div>

      {/* ── Mid Row: Spending Chart + Order Status Pie ── */}
      <div className="db-mid-row">
        {/* Spending Over Time */}
        <div className="db-section-card">
          <div className="db-section-header">
            <p className="db-section-title">Spending Over Time</p>
            <span className="db-badge">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6a6778" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6a6778" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1e7 ? `₹${(v / 1e7).toFixed(0)}Cr` : v >= 1e5 ? `₹${(v / 1e5).toFixed(0)}L` : `₹${v}`}
                width={52}
              />
              <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(201,168,76,0.2)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="spending" stroke="#c9a84c" strokeWidth={2}
                fill="url(#spendGrad)" dot={{ r: 4, fill: "#c9a84c", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#c9a84c" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="db-section-card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="db-section-header">
            <p className="db-section-title">Order Status</p>
          </div>
          {totalOrders === 0 ? (
            <div className="db-empty">No orders yet</div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
              <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%"
                      innerRadius={55} outerRadius={75}
                      dataKey="value" paddingAngle={3} strokeWidth={0}
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  <strong style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, color: "#f0ede6", lineHeight: 1 }}>
                    {totalOrders}
                  </strong>
                  <span style={{ fontSize: 10, color: "#6a6778", letterSpacing: 0.5, marginTop: 3 }}>Total Orders</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <CustomLegend data={statusData} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Order History Table ── */}
      <div className="db-order-table-wrap">
        <div className="db-section-header">
          <p className="db-section-title">Order History</p>
          <button className="db-view-all-btn" onClick={() => navigate("/orders")}>
            View All Orders
          </button>
        </div>

        {orderHistory.length === 0 ? (
          <div className="db-empty">No orders placed yet</div>
        ) : (
          <table className="db-order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Car</th>
                <th>Order Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => {
                const color = STATUS_COLORS[order.status] ?? "#c9a84c";
                const deliveryDate =
                  order.status === "delivered" && order.updatedAt
                    ? new Date(order.updatedAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    : "–";
                return (
                  <tr key={order._id} onClick={() => navigate("/orders")} style={{ cursor: "pointer" }}>
                    <td style={{ color: "#a09da8", fontFamily: "'Syne',sans-serif", fontSize: 12 }}>
                      {shortId(order._id)}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {order.items?.map((item, i) => {
                          const c = item?.carId;
                          return (
                            <div key={i} className="db-car-cell">
                              {c?.image && <img className="db-car-img" src={c.image} alt={c.model} />}
                              <span className="db-car-name">
                                {c ? `${c.brand} ${c.model}` : "Unknown Car"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="db-amount">{fmtRupees(order.totalPrice)}</td>
                    <td>
                      <span className="db-status-pill" style={{
                        background: `${color}22`, color: color, border: `1px solid ${color}44`,
                      }}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>
                    <td>{deliveryDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}