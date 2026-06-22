const mongoose = require("mongoose");

const notificationItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notifications: [notificationItemSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Notification', notificationSchema, "Notifications");