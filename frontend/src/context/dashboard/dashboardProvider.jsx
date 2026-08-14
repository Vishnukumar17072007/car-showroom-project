import { useState, useCallback, useEffect } from "react";
import { DashboardContext } from "./dashboardContext";
import { useAuth } from "../auth/useAuth";
import { apiGet } from "../../api/axios";

export function DashboardProvider({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  /* ── shared state ── */
  const [loading, setLoading] = useState(true);

  /* ── user state ── */
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [spendingOverTime, setSpendingOverTime] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  /* ── admin state ── */
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const [statsRes, ordersRes] = await Promise.all([
          apiGet("/dashboard/stats"),
          apiGet("/dashboard/recent-orders"),
        ]);
        setStats(statsRes);
        setRecentOrders(ordersRes || []);
      } else {
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
        setTotalOrders(orderStatsRes.count ?? 0);
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

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <DashboardContext.Provider
      value={{
        isAdmin,
        loading,
        wishlistCount,
        cartCount,
        totalOrders,
        totalSpent,
        spendingOverTime,
        orderStatus,
        orderHistory,
        stats,
        recentOrders,
        fetchDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}