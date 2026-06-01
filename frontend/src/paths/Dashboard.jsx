import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import API, { apiGet } from "../api/axios";
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Sector,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   COLOUR TOKENS
═══════════════════════════════════════════════════════════════════ */
const GOLD       = "#c9a84c";
const GOLD_FAINT = "rgba(201,168,76,0.12)";
const BLUE       = "#378ADD";
const GREEN      = "#1D9E75";
const AMBER      = "#EF9F27";
const RED        = "#E24B4A";
const PURPLE     = "#7F77DD";
const TEAL       = "#5DCAA5";

const STATUS_COLORS = {
  delivered: "#3db87a",
  pending:   "#f39c12",
  confirmed: "#3b82f6",
  cancelled: "#e05252",
};

const STATUS_LABEL = {
  delivered: "Delivered",
  pending:   "Processing",
  confirmed: "Shipped",
  cancelled: "Cancelled",
};

const BODY_COLORS = [BLUE, GREEN, PURPLE, AMBER, TEAL, "#888780", RED, GOLD];

const AVATAR_BG = [
  { bg: "rgba(55,138,221,0.18)",  color: BLUE   },
  { bg: "rgba(29,158,117,0.18)",  color: GREEN  },
  { bg: "rgba(239,159,39,0.18)",  color: AMBER  },
  { bg: "rgba(127,119,221,0.18)", color: PURPLE },
  { bg: "rgba(93,202,165,0.18)",  color: TEAL   },
];

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
function fmtRupees(n) {
  if (!n) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function initials(name = "") {
  return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
}

function avatarStyle(i) { return AVATAR_BG[i % AVATAR_BG.length]; }

const shortId = (id) => `#CF${id?.slice(-4).toUpperCase() ?? "----"}`;

/* ═══════════════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════ */

/* ── Stat Card ── */
function StatCard({ icon, iconBg, iconColor, label, value, sub, delta, deltaPositive, onClick }) {
  return (
    <div
      className="db-stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="db-stat-icon" style={{ background: iconBg, color: iconColor }}>
        <i className={icon} />
      </div>
      <div className="db-stat-body">
        <p className="db-stat-label">{label}</p>
        <h2 className="db-stat-value">{value}</h2>
        {sub && <p className="db-stat-sub">{sub}</p>}
        {delta && (
          <p style={{ fontSize: 11, color: deltaPositive ? GREEN : RED, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
            <i className={deltaPositive ? "bi bi-arrow-up-short" : "bi bi-arrow-down-short"} />
            {delta}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Dark Tooltip ── */
function DarkTooltip({ active, payload, label, rupee }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#16161c", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
    }}>
      <p style={{ color: "#a09da8", margin: "0 0 4px" }}>{label}</p>
      {rupee !== false && payload.length === 1 ? (
        <p style={{ color: GOLD, margin: 0, fontWeight: 600 }}>
          {fmtRupees(payload[0].value)}
        </p>
      ) : (
        payload.map((p, i) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: {rupee ? fmtRupees(p.value) : p.value.toLocaleString()}
          </p>
        ))
      )}
    </div>
  );
}

/* ── Custom Pie Legend (user) ── */
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

/* ── Active Pie Slice (admin) ── */
function renderActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#f0ede6" style={{ fontSize: 18, fontWeight: 600 }}>
        {payload.value}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#a09da8" style={{ fontSize: 12 }}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fill={fill} style={{ fontSize: 11 }}>
        {(percent * 100).toFixed(0)}%
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
}

/* ── Section Card wrapper (admin) ── */
function SectionCard({ title, badge, children }) {
  return (
    <div style={{
      background: "#111116", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 12, padding: "18px 20px", height: "100%", boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#a09da8", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
          {title}
        </p>
        {badge && (
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: GOLD_FAINT, color: GOLD, border: `1px solid rgba(201,168,76,0.3)` }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Skeleton (admin loading) ── */
function Skeleton({ h = 20, w = "100%", mb = 0 }) {
  return (
    <div style={{
      height: h, width: w, marginBottom: mb, borderRadius: 6,
      background: "linear-gradient(90deg,#1c1c24 0%,#26262f 45%,#1c1c24 100%)",
      backgroundSize: "220% 100%", animation: "skeletonGlow 1.4s ease-in-out infinite",
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const isAdmin    = user?.role === "admin";

  /* ── shared state ── */
  const [loading, setLoading] = useState(true);

  /* ── user state ── */
  const [wishlistCount,    setWishlistCount]    = useState(0);
  const [cartCount,        setCartCount]        = useState(0);
  const [totalOrders,      setTotalOrders]      = useState(0);
  const [totalSpent,       setTotalSpent]       = useState(0);
  const [spendingOverTime, setSpendingOverTime] = useState([]);
  const [orderStatus,      setOrderStatus]      = useState([]);
  const [orderHistory,     setOrderHistory]     = useState([]);

  /* ── admin state ── */
  const [stats,           setStats]           = useState(null);
  const [recentOrders,    setRecentOrders]    = useState([]);
  const [activePieIndex,  setActivePieIndex]  = useState(0);

  /* ── fetch ── */
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        /* admin: two endpoints */
        const [statsRes, ordersRes] = await Promise.all([
          API.get("/dashboard/stats"),
          API.get("/dashboard/recent-orders"),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data || []);
      } else {
        /* user: six endpoints */
        const [wishlistRes, cartRes, orderStatsRes, spendingRes, statusRes, historyRes] =
          await Promise.all([
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
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  /* ── user derived data ── */
  const statusData = useMemo(() =>
    orderStatus.map((s) => ({
      name:  s._id,
      value: s.count,
      fill:  STATUS_COLORS[s._id] ?? GOLD,
      pct:   totalOrders ? Math.round((s.count / totalOrders) * 100) : 0,
    })),
  [orderStatus, totalOrders]);

  const monthlyData = useMemo(() =>
    spendingOverTime.map((s) => ({
      month:    new Date(s._id.year, s._id.month - 1).toLocaleString("en-IN", { month: "short" }),
      spending: s.total,
    })),
  [spendingOverTime]);

  /* ── admin derived data ── */
  const pieData = stats
    ? Object.entries(stats.statusCounts || {}).map(([name, value]) => ({
        name, value, fill: STATUS_COLORS[name] || GOLD,
      }))
    : [];

  const revenueTickFmt = (v) => {
    if (v >= 1e5) return `₹${(v / 1e5).toFixed(0)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
    return `₹${v}`;
  };

  const axisStyle   = { fontSize: 11, fill: "#6a6778" };
  const gridStyle   = { stroke: "rgba(255,255,255,0.06)" };
  const cursorStyle = { fill: "rgba(255,255,255,0.04)" };

  /* ═══════════════════════════════════════════════════════════════
     ADMIN LAYOUT
  ═══════════════════════════════════════════════════════════════ */
  if (isAdmin) {
    return (
      <>
        <style>{`
          @keyframes skeletonGlow {
            0%   { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
          .db-scroll {
            width: 100%;
            height: calc(100vh - 54px);
            overflow-y: auto;
            padding: 20px 24px 32px;
            box-sizing: border-box;
          }
          .db-scroll::-webkit-scrollbar { display: none; }
        `}</style>

        <div className="db-scroll">

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "#f0ede6", margin: 0, letterSpacing: 1 }}>
                Admin Dashboard
              </h1>
              <p style={{ fontSize: 12, color: "#6a6778", margin: "4px 0 0" }}>
                Real-time overview of your CarField platform
              </p>
            </div>
            <button
              onClick={fetchDashboard}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8,
                border: "1px solid rgba(201,168,76,0.35)", background: GOLD_FAINT,
                color: GOLD, fontSize: 12, cursor: "pointer", fontWeight: 500,
              }}
            >
              <i className="bi bi-arrow-clockwise" />
              Refresh
            </button>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ flex: 1, background: "#111116", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 20 }}>
                  <Skeleton h={30} w={30} mb={12} />
                  <Skeleton h={10} w="50%" mb={8} />
                  <Skeleton h={24} w="70%" mb={8} />
                  <Skeleton h={10} w="40%" />
                </div>
              ))
            ) : (
              <>
                <StatCard icon="bi bi-people-fill"     label="Total Users"    value={stats?.totalUsers?.toLocaleString() || "0"}  delta="+users registered" deltaPositive iconBg="rgba(55,138,221,0.18)"  iconColor={BLUE}  />
                <StatCard icon="bi bi-car-front-fill"  label="Active Cars"    value={stats?.totalCars?.toLocaleString() || "0"}   iconBg="rgba(201,168,76,0.18)"  iconColor={GOLD}  />
                <StatCard icon="bi bi-box-seam-fill"   label="Total Orders"   value={stats?.totalOrders?.toLocaleString() || "0"} delta="+orders placed" deltaPositive iconBg="rgba(29,158,117,0.18)"  iconColor={GREEN} />
                <StatCard icon="bi bi-currency-rupee" label="Total Revenue"  value={fmtRupees(stats?.totalRevenue || 0)}          delta="lifetime revenue" deltaPositive={stats?.totalRevenue > 0} iconBg="rgba(239,159,39,0.18)"  iconColor={AMBER} />
              </>
            )}
          </div>

          {/* Row 1: Line Chart + Pie */}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12, marginBottom: 12 }}>

            <SectionCard title="Monthly Revenue & Orders" badge="Last 7 months">
              {loading ? <Skeleton h={220} /> : (
                <>
                  <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                    {[{ color: BLUE, label: "Revenue" }, { color: GREEN, label: "Orders", dashed: true }].map(l => (
                      <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#a09da8" }}>
                        <span style={{ width: 18, height: 3, borderRadius: 2, background: l.dashed ? "none" : l.color, border: l.dashed ? `2px dashed ${l.color}` : "none", display: "inline-block" }} />
                        {l.label}
                      </span>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={stats?.monthlyData || []} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                      <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="rev" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={revenueTickFmt} width={52} />
                      <YAxis yAxisId="ord" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} width={32} />
                      <Tooltip content={<DarkTooltip rupee />} cursor={cursorStyle} />
                      <Line yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke={BLUE}  strokeWidth={2} dot={{ r: 3, fill: BLUE }}  activeDot={{ r: 5 }} />
                      <Line yAxisId="ord" type="monotone" dataKey="orders"  name="Orders"  stroke={GREEN} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3, fill: GREEN }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
            </SectionCard>

            <SectionCard title="Order Status">
              {loading ? <Skeleton h={220} /> : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData} cx="50%" cy="50%"
                        innerRadius={52} outerRadius={72}
                        dataKey="value" paddingAngle={3}
                        activeIndex={activePieIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, i) => setActivePieIndex(i)}
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} strokeWidth={0} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                    {pieData.map(d => (
                      <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#a09da8" }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, flexShrink: 0 }} />
                        <span style={{ textTransform: "capitalize" }}>{d.name}</span>
                        <span style={{ marginLeft: "auto", color: d.fill, fontWeight: 600 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </SectionCard>
          </div>

          {/* Row 2: Bar Chart + Recent Orders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

            <SectionCard title="Cars by Body Type" badge="Inventory">
              {loading ? <Skeleton h={220} /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats?.carsByBodyType || []} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                    <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                    <Tooltip content={<DarkTooltip />} cursor={cursorStyle} />
                    <Bar dataKey="count" name="Cars" radius={[4, 4, 0, 0]}>
                      {(stats?.carsByBodyType || []).map((_, i) => (
                        <Cell key={i} fill={BODY_COLORS[i % BODY_COLORS.length]} />
                      ))}
                      <LabelList dataKey="count" position="top" style={{ fontSize: 10, fill: "#a09da8" }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </SectionCard>

            <SectionCard title="Recent Orders" badge="Latest 10">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <Skeleton h={30} w={30} />
                    <div style={{ flex: 1 }}><Skeleton h={11} w="60%" mb={5} /><Skeleton h={10} w="40%" /></div>
                    <div><Skeleton h={12} w={50} mb={5} /><Skeleton h={10} w={50} /></div>
                  </div>
                ))
              ) : (
                <div style={{ overflowY: "auto", maxHeight: 260 }}>
                  {recentOrders.length === 0 ? (
                    <p style={{ color: "#6a6778", fontSize: 13, textAlign: "center", marginTop: 40 }}>No orders yet.</p>
                  ) : recentOrders.map((order, i) => {
                    const u  = order.userId;
                    const av = avatarStyle(i);
                    return (
                      <div key={order._id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "9px 0",
                        borderBottom: i < recentOrders.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: av.bg, color: av.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 600, flexShrink: 0,
                        }}>
                          {initials(u?.userName || "?")}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: "#f0ede6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {u?.userName || "Unknown"}
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {order.items?.map((item, idx) => {
                              const c = item?.carId;
                              return (
                                <p key={idx} style={{ margin: 0, fontSize: 11, color: "#6a6778", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {c ? `${c.brand} ${c.model}` : "Unknown Car"}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 600, color: "#f0ede6" }}>
                            {fmtRupees(order.totalPrice)}
                          </p>
                          <span style={{
                            fontSize: 10, padding: "2px 7px", borderRadius: 20,
                            background: `${STATUS_COLORS[order.status] || GOLD}22`,
                            color: STATUS_COLORS[order.status] || GOLD,
                            textTransform: "capitalize", fontWeight: 600,
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>

        </div>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     USER LAYOUT
  ═══════════════════════════════════════════════════════════════ */
  if (loading) return <div className="db-empty">Loading dashboard...</div>;

  return (
    <div className="db-page">

      {/* Header */}
      <div className="db-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your activity on CarField</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="db-stats-row">
        <StatCard
          icon="bi bi-heart-fill"
          iconBg="rgba(224,82,82,0.15)" iconColor="#e05252"
          label="Wishlist" value={wishlistCount} sub="Cars in wishlist"
          onClick={() => navigate("/wishlist")}
        />
        <StatCard
          icon="bi bi-cart-fill"
          iconBg="rgba(55,138,221,0.15)" iconColor="#378ADD"
          label="Cart List" value={cartCount} sub="Cars in cart"
          onClick={() => navigate("/cartList")}
        />
        <StatCard
          icon="bi bi-bag-check-fill"
          iconBg="rgba(29,158,117,0.15)" iconColor="#1D9E75"
          label="Total Orders" value={totalOrders} sub="Orders placed"
          onClick={() => navigate("/orders")}
        />
        <StatCard
          icon="bi bi-currency-rupee"
          iconBg="rgba(127,119,221,0.15)" iconColor="#7F77DD"
          label="Total Spent" value={fmtRupees(totalSpent)} sub="Total amount spent"
        />
      </div>

      {/* Mid Row: Spending Chart + Order Status Pie */}
      <div className="db-mid-row">

        {/* Area Chart */}
        <div className="db-section-card">
          <div className="db-section-header">
            <p className="db-section-title">Spending Over Time</p>
            <span className="db-badge">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GOLD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6a6778" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6a6778" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1e7 ? `₹${(v/1e7).toFixed(0)}Cr` : v >= 1e5 ? `₹${(v/1e5).toFixed(0)}L` : `₹${v}`}
                width={52}
              />
              <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(201,168,76,0.2)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="spending" stroke={GOLD} strokeWidth={2}
                fill="url(#spendGrad)" dot={{ r: 4, fill: GOLD, strokeWidth: 0 }} activeDot={{ r: 6, fill: GOLD }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
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

      {/* Order History Table */}
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
                const color = STATUS_COLORS[order.status] ?? GOLD;
                const deliveryDate =
                  order.status === "delivered" && order.updatedAt
                    ? new Date(order.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
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
                              <span className="db-car-name">{c ? `${c.brand} ${c.model}` : "Unknown Car"}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="db-amount">{fmtRupees(order.totalPrice)}</td>
                    <td>
                      <span className="db-status-pill" style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
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