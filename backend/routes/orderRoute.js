const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const verifyRole = require("../middleware/verifyRole");

const asyncHandler = require("../utils/asyncHandler");

const {
  createOrder,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderController");

const {
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderAdminController");

// USER

router.post("/", verifyToken, asyncHandler(createOrder));

router.get("/", verifyToken, asyncHandler(getUserOrders));

// ADMIN

router.get(
  "/admin/all",
  verifyToken,
  verifyRole("admin"),
  asyncHandler(getAllOrders),
);

router.put(
  "/admin/:id/status",
  verifyToken,
  verifyRole("admin"),
  asyncHandler(updateOrderStatus),
);

router.delete(
  "/admin/:id",
  verifyToken,
  verifyRole("admin"),
  asyncHandler(deleteOrder),
);

module.exports = router;
