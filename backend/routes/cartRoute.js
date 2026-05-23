const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const validateRequest = require("../middleware/validationMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { cartValidation } = require("../validations/cartValidation");
const {getCart, addToCart, removeFromCart} = require("../controllers/cartController");
const {clearCart, updateQuantity} = require("../controllers/cartAdminController");

router.get("/", verifyToken, asyncHandler(getCart));
router.post("/", verifyToken, cartValidation, validateRequest, asyncHandler(addToCart),);
router.delete("/:id", verifyToken, asyncHandler(removeFromCart));
router.put("/:id", verifyToken, asyncHandler(updateQuantity));
router.delete("/clear/all", verifyToken, asyncHandler(clearCart));

module.exports = router;