const Notification = require("../models/NotificationSchema");
const { getIO } = require("../socket");
const { emitNotificationsToUser } = require("../socket/notificationSocket");

// Used by other controllers internally
const saveNotification = async ({ user, title, message }) => {
  await Notification.findOneAndUpdate(
    { user },
    { $push: { notifications: { title, message, read: false } } },
    { upsert: true, new: true },
  );

  const io = getIO();
  if (io) {
    await emitNotificationsToUser(io, user.toString());
  }
};

module.exports = { saveNotification };