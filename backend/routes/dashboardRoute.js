const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const asyncHandler = require("../utils/asyncHandler");
const { getWishlistCount, getCartCount, getOrderStats, 
    getSpendingOverTime, getOrderStatus, getOrderHistory } = require("../controllers/dashboardController");
const { getDashboardStats, getRecentOrders } = require("../controllers/adminDashboardController");

//user dashboard
router.get("/wishlist-count", verifyToken, asyncHandler(getWishlistCount));
router.get("/cart-count", verifyToken, asyncHandler(getCartCount));
router.get("/order-stats", verifyToken, asyncHandler(getOrderStats));
router.get("/spending-over-time", verifyToken, asyncHandler(getSpendingOverTime));
router.get("/order-status", verifyToken, asyncHandler(getOrderStatus));
router.get("/order-history", verifyToken, asyncHandler(getOrderHistory));

//admin dashboard
router.get("/stats", verifyToken, verifyRole("admin"), asyncHandler(getDashboardStats));
router.get("/recent-orders", verifyToken, verifyRole("admin"), asyncHandler(getRecentOrders));

module.exports = router;