const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const asyncHandler = require("../utils/asyncHandler");
const { createOrder, getUserOrders, softDeleteOrder } = require("../controllers/orderController");
const { updateOrderStatus, deleteOrder, getAllOrders } = require("../controllers/orderAdminController");

//user routes
router.post("/", verifyToken, asyncHandler(createOrder));
router.get("/", verifyToken, asyncHandler(getUserOrders));
router.patch("/soft-delete/:id", verifyToken, asyncHandler(softDeleteOrder));
//user route by but controller on orderAdminController
router.patch("/cancel/:id", verifyToken, asyncHandler(updateOrderStatus));
//admin routes
router.get("/admin/all", verifyToken, verifyRole("admin"), asyncHandler(getAllOrders));
router.put("/admin/:id/status", verifyToken, verifyRole("admin"), asyncHandler(updateOrderStatus));
router.delete("/admin/:id", verifyToken, verifyRole("admin"), asyncHandler(deleteOrder));

module.exports = router;