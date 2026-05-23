const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const asyncHandler = require("../utils/asyncHandler");
const { createOrder, getUserOrders, getAllOrders} = require("../controllers/orderController");
const { updateOrderStatus, deleteOrder } = require("../controllers/orderAdminController");

router.post("/", verifyToken, asyncHandler(createOrder));
router.get("/", verifyToken, asyncHandler(getUserOrders));
router.get("/admin/all", verifyToken, verifyRole("admin"), asyncHandler(getAllOrders));
router.patch("/cancel/:id", verifyToken, asyncHandler(updateOrderStatus));
router.delete("/delete/:id", verifyToken, asyncHandler(deleteOrder));

module.exports = router;