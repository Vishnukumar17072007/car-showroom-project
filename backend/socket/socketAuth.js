const jwt = require("jsonwebtoken");

function socketAuth(socket, next) {
  const authToken = socket.handshake.auth?.token;
  const headerToken = socket.handshake.headers?.authorization?.startsWith("Bearer ")
    ? socket.handshake.headers.authorization.split(" ")[1]
    : null;

  const token = authToken || headerToken;

  if (!token) {
    return next(new Error("Not authenticated"));
  }

  try {
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
}

module.exports = socketAuth;
