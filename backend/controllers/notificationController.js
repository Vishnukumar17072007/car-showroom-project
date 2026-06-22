const Notification = require("../models/NotificationSchema");
const { getIO } = require("../socket");
const { emitNotificationsToUser } = require("../socket/notificationSocket");

// Used by other controllers internally
const saveNotification = async ({ user, title, message }) => {

  const newNotification = {
    title,
    message,
    createdAt: new Date(), // explicit fallback, safe even if using $push
  };

  await Notification.findOneAndUpdate(
    { user },
    { $push: { notifications: newNotification } },
    { upsert: true, new: true },
  );

  const io = getIO();
  if (io) {
    await emitNotificationsToUser(io, user.toString());
  }
};

module.exports = { saveNotification };