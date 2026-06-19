const { Server } = require("socket.io");
const { setupNotificationSocket } = require("./notificationSocket");

let io = null;

function getAllowedOrigins() {
  const defaults = [
    "http://localhost:5173",
    "http://localhost:1200",
    "https://car-showroom-project-d4e5.vercel.app",
    "https://carfield.vercel.app",
  ];

  const fromEnv = (process.env.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return [...new Set([...defaults, ...fromEnv])];
}

function initSocket(httpServer) {
  const allowedOrigins = getAllowedOrigins();
  const vercelPreview = /^https:\/\/car-showroom-project-d4e5.*\.vercel\.app$/;

  io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || vercelPreview.test(origin)) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      credentials: true,
    },
  });

  setupNotificationSocket(io);
  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
