const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const asyncHandler = require("../utils/asyncHandler");
const { createOrder, getOrders, softDeleteOrder, updateOrderStatus, deleteOrder, } = require("../controllers/orderController");

//user routes
router.get("/", verifyToken, asyncHandler(getOrders));
router.post("/", verifyToken, asyncHandler(createOrder));
router.patch("/soft-delete/:id", verifyToken, asyncHandler(softDeleteOrder));
router.patch("/cancel/:id", verifyToken, asyncHandler(updateOrderStatus));
//admin routes
router.put("/:id/status", verifyToken, verifyRole("admin"), asyncHandler(updateOrderStatus));
router.delete("/:id", verifyToken, verifyRole("admin"), asyncHandler(deleteOrder));

module.exports = router;