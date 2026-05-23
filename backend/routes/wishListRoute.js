const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const validateRequest = require("../middleware/validationMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { wishlistValidation } = require("../validations/wishListValidation");
const { getWishlist, addToWishlist, removeFromWishlist } = require("../controllers/wishListController");

router.get( "/", verifyToken, asyncHandler(getWishlist) );
router.post( "/", verifyToken, wishlistValidation, validateRequest, asyncHandler(addToWishlist));
router.delete( "/:id", verifyToken, asyncHandler(removeFromWishlist));

module.exports = router;