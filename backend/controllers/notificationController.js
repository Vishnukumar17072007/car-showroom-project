const Notification = require("../models/NotificationSchema");

// Used by other controllers internally
const saveNotification = async ({ user, title, message }) => {
  await Notification.findOneAndUpdate(
    { user },
    { $push: { notifications: { title, message, read: false } } },
    { upsert: true, new: true } // create document if it doesn't exist yet
  );
};

const getNotifications = async (req, res) => {
  const doc = await Notification.findOne({ user: req.user.userId });
  const notifications = doc ? doc.notifications : [];
  res.status(200).json(notifications);
};

const createNotification = async (req, res) => {
  await saveNotification({
    user: req.body.user,
    title: req.body.title,
    message: req.body.message,
  });
  res.status(201).json({ message: "Notification created" });
};

const markAsRead = async (req, res) => {
  const result = await Notification.updateOne(
    { user: req.user.userId, "notifications._id": req.params.id },
    { $set: { "notifications.$.read": true } }
  );

  if (result.matchedCount === 0) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }

  res.status(200).json({ message: "Notification marked as read" });
};

const clearNotifications = async (req, res) => {
  await Notification.updateOne(
    { user: req.user.userId },
    { $set: { notifications: [] } } // empties the array, document stays in DB
  );
  res.status(200).json({ message: "Notifications cleared" });
};

module.exports = { saveNotification, getNotifications, createNotification, markAsRead, clearNotifications };