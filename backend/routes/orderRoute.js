const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const validateRequest = require("../middleware/validationMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { orderValidation } = require("../validations/orderValidation");

const { createOrder, getUserOrders, getAllOrders } = require("../controllers/orderController");
const { updateOrderStatus, deleteOrder } = require("../controllers/orderAdminController");

router.get('/', verifyToken, asyncHandler(getUserOrders));
router.post( "/", verifyToken, orderValidation, validateRequest, asyncHandler(createOrder) );
router.get("/my-orders", verifyToken, asyncHandler(getUserOrders));
router.get("/admin", verifyToken, verifyRole("admin"), asyncHandler(getAllOrders));
router.put("/:id", verifyToken, verifyRole("admin"), asyncHandler(updateOrderStatus));
router.delete("/:id", verifyToken, verifyRole("admin"), asyncHandler(deleteOrder));

module.exports = router;