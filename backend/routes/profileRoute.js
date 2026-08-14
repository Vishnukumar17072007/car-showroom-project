const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const asyncHandler = require("../utils/asyncHandler");
const validateRequest = require("../middleware/validationMiddleware");
const { updateProfileValidation } = require("../validations/profileValidation");
const { getUser, updateProfile } = require("../controllers/profileController");
const {upload, limitChecker} = require("../middleware/upload");
const { uploadPhoto } = require("../controllers/photoController");

router.get("/me", verifyToken, asyncHandler(getUser));

router.put("/update", verifyToken, updateProfileValidation, validateRequest, asyncHandler(updateProfile));

router.post("/upload-photo", verifyToken, upload.single("photo"), limitChecker, asyncHandler(uploadPhoto));

module.exports = router;