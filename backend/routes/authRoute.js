const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validationMiddleware");
const {registerValidation, loginValidation} = require("../validations/authValidation");
const { updateProfileValidation } = require("../validations/profileValidation");
const { register, login, logout } = require("../controllers/authController");
const {getProfile, updateProfile} = require("../controllers/profileController");

router.post("/register", registerValidation, validateRequest, asyncHandler(register),);
router.post("/login", loginValidation, validateRequest, asyncHandler(login));
router.post("/logout", verifyToken, asyncHandler(logout));
router.get("/me", verifyToken, asyncHandler(getProfile));
router.put("/update", verifyToken, updateProfileValidation, validateRequest, asyncHandler(updateProfile));

module.exports = router;