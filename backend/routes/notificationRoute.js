const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const asyncHandler = require("../utils/asyncHandler");
const { getNotifications, createNotification, clearNotifications, markAsRead } = require("../controllers/notificationController");

router.get("/", verifyToken, asyncHandler(getNotifications));
router.post("/", verifyToken, verifyRole("admin"), asyncHandler(createNotification));
router.put("/clear", verifyToken, asyncHandler(clearNotifications)); // ✅ specific route first
router.put("/:id", verifyToken, asyncHandler(markAsRead));           // ✅ param route second

module.exports = router;