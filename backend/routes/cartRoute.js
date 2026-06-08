const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const validateRequest = require("../middleware/validationMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { cartValidation } = require("../validations/cartValidation");
const {getCart, addToCart, removeFromCart, clearCart} = require("../controllers/cartController");

router.get("/", verifyToken, asyncHandler(getCart));
router.post("/", verifyToken, cartValidation, validateRequest, asyncHandler(addToCart),);
router.delete("/:id", verifyToken, asyncHandler(removeFromCart));
//admin route
router.put("/clear/:id", verifyToken, asyncHandler(clearCart));

module.exports = router;