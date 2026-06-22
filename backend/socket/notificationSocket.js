const Notification = require("../models/NotificationSchema");
const socketAuth = require("./socketAuth");

const NAMESPACE = "/notifications";

async function getNotificationsForUser(userId) {
  const doc = await Notification.findOne({ user: userId });
  return (
    doc ? doc.notifications.sort(
      (a,b) => new Date(b.createdAt) - new Date(a.createdAt)
    ) : []
  );
}

async function emitNotificationsToUser(io, userId) {
  const notifications = await getNotificationsForUser(userId);
  io.of(NAMESPACE).to(`user:${userId}`).emit("notifications:list", notifications);
  return notifications;
}

function setupNotificationSocket(io) {
  const notificationIo = io.of(NAMESPACE);

  notificationIo.use(socketAuth);

  notificationIo.on("connection", async (socket) => {
    const userId = socket.user.userId;
    socket.join(`user:${userId}`);

    try {
      const notifications = await getNotificationsForUser(userId);
      socket.emit("notifications:list", notifications);
    } catch {
      socket.emit("notifications:list", []);
    }

    socket.on("notifications:get", async (callback) => {
      try {
        const notifications = await getNotificationsForUser(userId);
        socket.emit("notifications:list", notifications);
        if (typeof callback === "function") callback({ ok: true });
      } catch (err) {
        if (typeof callback === "function") callback({ error: err.message });
      }
    });

    socket.on("notifications:create", async (data, callback) => {
      if (socket.user.role !== "admin") {
        if (typeof callback === "function") callback({ error: "Access denied" });
        return;
      }

      const { user, title, message } = data || {};

      if (!user || !title || !message) {
        if (typeof callback === "function") callback({ error: "user, title, and message are required" });
        return;
      }

      try {
        await Notification.findOneAndUpdate(
          { user },
          { $push: { notifications: { title, message, read: false } } },
          { upsert: true, new: true },
        );

        await emitNotificationsToUser(io, user);
        if (typeof callback === "function") callback({ ok: true });
      } catch (err) {
        if (typeof callback === "function") callback({ error: err.message });
      }
    });

    socket.on("notifications:mark-read", async ({ id }, callback) => {
      try {
        const result = await Notification.updateOne(
          { user: userId, "notifications._id": id },
          { $set: { "notifications.$.read": true } },
        );

        if (result.matchedCount === 0) {
          if (typeof callback === "function") callback({ error: "Notification not found" });
          return;
        }

        await emitNotificationsToUser(io, userId);
        if (typeof callback === "function") callback({ ok: true });
      } catch (err) {
        if (typeof callback === "function") callback({ error: err.message });
      }
    });

    socket.on("notifications:clear", async (callback) => {
      try {
        await Notification.updateOne({ user: userId }, { $set: { notifications: [] } });
        await emitNotificationsToUser(io, userId);
        if (typeof callback === "function") callback({ ok: true });
      } catch (err) {
        if (typeof callback === "function") callback({ error: err.message });
      }
    });
  });
}

module.exports = { setupNotificationSocket, emitNotificationsToUser, NAMESPACE };
