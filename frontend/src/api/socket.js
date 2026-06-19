import { io } from "socket.io-client";

const NAMESPACE = "/notifications";

let socket = null;

function getSocketUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || "";
  return apiUrl.replace(/\/api\/?$/, "");
}

export function connectNotificationSocket() {
  const token = localStorage.getItem("token");
  const url = getSocketUrl();

  if (socket) {
    socket.auth = { token };
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  socket = io(`${url}${NAMESPACE}`, {
    auth: { token },
    withCredentials: true,
    autoConnect: Boolean(token),
  });

  return socket;
}

export function disconnectNotificationSocket() {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners();
    socket = null;
  }
}

export function getNotificationSocket() {
  return socket;
}
