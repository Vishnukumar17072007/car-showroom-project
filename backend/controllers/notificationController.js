const Notification = require("../models/NotificationSchema");

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user.userId })
    .sort({ createdAt: -1 });
  res.status(200).json(notifications);
};

const createNotification = async (req, res) => {
  const notification = new Notification({
    user: req.body.user,
    title: req.body.title,
    message: req.body.message,
  });
  await notification.save();
  res.status(201).json({ message: "Notification created", notification });
};

const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }
  notification.read = true;
  await notification.save();
  res.status(200).json({ message: "Notification updated" });
};

module.exports = { getNotifications, createNotification, markAsRead};