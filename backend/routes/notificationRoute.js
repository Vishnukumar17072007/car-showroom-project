const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const asyncHandler = require("../utils/asyncHandler");
const { getNotifications, createNotification, markAsRead} = require("../controllers/notificationController");

router.get( "/", verifyToken, asyncHandler(getNotifications));
router.post( "/", verifyToken, verifyRole("admin"), asyncHandler(createNotification));
router.put( "/:id", verifyToken, asyncHandler(markAsRead));

module.exports = router;