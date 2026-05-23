const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const asyncHandler = require("../utils/asyncHandler");
const { getDashboardStats, getRecentOrders } = require("../controllers/dashboardController");

router.get( "/stats", verifyToken, verifyRole("admin"), asyncHandler(getDashboardStats));
router.get("/recent-orders", verifyToken, verifyRole("admin"), asyncHandler(getRecentOrders));

module.exports = router;