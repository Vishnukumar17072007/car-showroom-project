import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Sector,
    BarChart, Bar, LabelList
} from "recharts";

// ── colour tokens matching existing app theme ────────────────────────────────
const GOLD = "#c9a84c";
const GOLD_FAINT = "rgba(201,168,76,0.12)";
const BLUE = "#378ADD";
const GREEN = "#1D9E75";
const AMBER = "#EF9F27";
const RED = "#E24B4A";
const PURPLE = "#7F77DD";
const TEAL = "#5DCAA5";

const STATUS_COLORS = {
    pending:   AMBER,
    confirmed: GREEN,
    delivered: BLUE,
    cancelled: RED
};

const BODY_COLORS = [BLUE, GREEN, PURPLE, AMBER, TEAL, "#888780", RED, GOLD];

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtRupees(n) {
    if (!n) return "₹0";
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)} Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
}

function initials(name = "") {
    return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
}

const AVATAR_BG = [
    { bg: "rgba(55,138,221,0.18)", color: BLUE },
    { bg: "rgba(29,158,117,0.18)", color: GREEN },
    { bg: "rgba(239,159,39,0.18)", color: AMBER },
    { bg: "rgba(127,119,221,0.18)", color: PURPLE },
    { bg: "rgba(93,202,165,0.18)", color: TEAL },
];
function avatarStyle(i) { return AVATAR_BG[i % AVATAR_BG.length]; }

// ── stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, delta, deltaPositive, iconBg, iconColor }) {
    return (
        <div style={{
            background: "#111116", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 0
        }}>
            <div style={{
                width: 34, height: 34, borderRadius: 8, display: "flex",
                alignItems: "center", justifyContent: "center",
                background: iconBg, color: iconColor, fontSize: 17, marginBottom: 10
            }}>
                <i className={icon} aria-hidden="true" />
            </div>
            <p style={{ fontSize: 11, color: "#a09da8", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>
                {label}
            </p>
            <p style={{ fontSize: 24, fontWeight: 600, color: "#f0ede6", margin: "0 0 6px", fontFamily: "var(--font-display,'Syne',sans-serif)" }}>
                {value}
            </p>
            {delta && (
                <p style={{ fontSize: 11, color: deltaPositive ? GREEN : RED, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    <i className={deltaPositive ? "bi bi-arrow-up-short" : "bi bi-arrow-down-short"} />
                    {delta}
                </p>
            )}
        </div>
    );
}

// ── chart tooltip ────────────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label, rupee }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "#16161c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
            <p style={{ color: "#a09da8", margin: "0 0 6px" }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, margin: "2px 0" }}>
                    {p.name}: {rupee ? fmtRupees(p.value) : p.value.toLocaleString()}
                </p>
            ))}
        </div>
    );
}

// ── custom active pie slice ───────────────────────────────────────────────────
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

// ── section header ────────────────────────────────────────────────────────────
function SectionCard({ title, badge, children }) {
    return (
        <div style={{
            background: "#111116", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, padding: "18px 20px", height: "100%", boxSizing: "border-box"
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

// ── loading skeleton ──────────────────────────────────────────────────────────
function Skeleton({ h = 20, w = "100%", mb = 0 }) {
    return (
        <div style={{
            height: h, width: w, marginBottom: mb, borderRadius: 6,
            background: "linear-gradient(90deg,#1c1c24 0%,#26262f 45%,#1c1c24 100%)",
            backgroundSize: "220% 100%", animation: "skeletonGlow 1.4s ease-in-out infinite"
        }} />
    );
}

// ── main component ────────────────────────────────────────────────────────────
function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activePieIndex, setActivePieIndex] = useState(0);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes] = await Promise.all([
                API.get("/dashboard/stats"),
                API.get("/dashboard/recent-orders")
            ]);
            setStats(statsRes.data);
            setRecentOrders(ordersRes.data || []);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── pie data ──────────────────────────────────────────────────────────────
    const pieData = stats ? Object.entries(stats.statusCounts || {}).map(([name, value]) => ({
        name, value, fill: STATUS_COLORS[name] || GOLD
    })) : [];

    // ── tick formatters ───────────────────────────────────────────────────────
    const revenueTickFmt = (v) => {
        if (v >= 1e5) return `₹${(v / 1e5).toFixed(0)}L`;
        if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
        return `₹${v}`;
    };

    // ── styles ────────────────────────────────────────────────────────────────
    const axisStyle = { fontSize: 11, fill: "#6a6778" };
    const gridStyle = { stroke: "rgba(255,255,255,0.06)" };
    const cursorStyle = { fill: "rgba(255,255,255,0.04)" };

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

                {/* ── Header ── */}
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
                        onClick={fetchAll}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "7px 14px", borderRadius: 8,
                            border: "1px solid rgba(201,168,76,0.35)", background: GOLD_FAINT,
                            color: GOLD, fontSize: 12, cursor: "pointer", fontWeight: 500
                        }}
                    >
                        <i className="bi bi-arrow-clockwise" aria-hidden="true" />
                        Refresh
                    </button>
                </div>

                {/* ── Stat Cards ── */}
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
                            <StatCard icon="bi bi-people-fill" label="Total Users" value={stats?.totalUsers?.toLocaleString() || "0"}
                                delta="+users registered" deltaPositive iconBg="rgba(55,138,221,0.18)" iconColor={BLUE} />
                            <StatCard icon="bi bi-car-front-fill" label="Active Cars" value={stats?.totalCars?.toLocaleString() || "0"}
                                iconBg="rgba(201,168,76,0.18)" iconColor={GOLD} />
                            <StatCard icon="bi bi-box-seam-fill" label="Total Orders" value={stats?.totalOrders?.toLocaleString() || "0"}
                                delta="+orders placed" deltaPositive iconBg="rgba(29,158,117,0.18)" iconColor={GREEN} />
                            <StatCard icon="bi bi-currency-rupee" label="Total Revenue" value={fmtRupees(stats?.totalRevenue || 0)}
                                delta="lifetime revenue" deltaPositive={stats?.totalRevenue > 0} iconBg="rgba(239,159,39,0.18)" iconColor={AMBER} />
                        </>
                    )}
                </div>

                {/* ── Row 1: Line Chart + Pie Chart ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12, marginBottom: 12 }}>

                    {/* Line Chart */}
                    <SectionCard title="Monthly Revenue & Orders" badge="Last 7 months">
                        {loading ? <Skeleton h={220} /> : (
                            <>
                                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                                    {[{ color: BLUE, label: "Revenue" }, { color: GREEN, label: "Orders", dashed: true }].map(l => (
                                        <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#a09da8" }}>
                                            <span style={{
                                                width: 18, height: 3, borderRadius: 2, background: l.dashed ? "none" : l.color,
                                                border: l.dashed ? `2px dashed ${l.color}` : "none", display: "inline-block"
                                            }} />
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
                                        <Line yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke={BLUE} strokeWidth={2} dot={{ r: 3, fill: BLUE }} activeDot={{ r: 5 }} />
                                        <Line yAxisId="ord" type="monotone" dataKey="orders" name="Orders" stroke={GREEN} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3, fill: GREEN }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </SectionCard>

                    {/* Pie Chart */}
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

                {/* ── Row 2: Bar Chart + Recent Orders ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                    {/* Bar Chart */}
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

                    {/* Recent Orders */}
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
                                    const user = order.userId;
                                    const av = avatarStyle(i);
                                    return (
                                        <div key={order._id} style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            padding: "9px 0",
                                            borderBottom: i < recentOrders.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none"
                                        }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: "50%",
                                                background: av.bg, color: av.color,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 11, fontWeight: 600, flexShrink: 0
                                            }}>
                                                {initials(user?.userName || "?")}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: "#f0ede6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {user?.userName || "Unknown"}
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
                                                    textTransform: "capitalize", fontWeight: 600
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

export default AdminDashboard;