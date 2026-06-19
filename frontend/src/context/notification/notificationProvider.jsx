import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

import { NotificationContext } from "./notificationContext";
import { useAuth } from "../auth/useAuth";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  getNotificationSocket,
} from "../../api/socket";

export const NotificationProvider = ({ children }) => {
  const { user, authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setNotifications([]);
      setNotifLoading(false);
      disconnectNotificationSocket();
      return;
    }

    const socket = connectNotificationSocket();

    const handleList = (list) => {
      setNotifications(list);
      setNotifLoading(false);
    };

    const handleConnectError = () => {
      setNotifications([]);
      setNotifLoading(false);
    };

    socket.on("notifications:list", handleList);
    socket.on("connect_error", handleConnectError);

    if (socket.connected) {
      socket.emit("notifications:get");
    } else {
      socket.once("connect", () => {
        socket.emit("notifications:get");
      });
    }

    return () => {
      socket.off("notifications:list", handleList);
      socket.off("connect_error", handleConnectError);
      disconnectNotificationSocket();
    };
  }, [user, authLoading]);

  const fetchNotifications = useCallback(() => {
    const socket = getNotificationSocket();
    if (!socket.connected) {
      connectNotificationSocket();
      return;
    }
    setNotifLoading(true);
    socket.emit("notifications:get", () => {
      setNotifLoading(false);
    });
  }, []);

  const markAsRead = (id) => {
    const socket = getNotificationSocket();
    socket.emit("notifications:mark-read", { id }, (response) => {
      if (response?.error) {
        toast.error("Failed to mark as read.");
      }
    });
  };

  const clearNotifications = () => {
    const socket = getNotificationSocket();
    socket.emit("notifications:clear", (response) => {
      if (response?.error) {
        toast.error("Failed to clear notifications");
      }
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notifLoading,
        fetchNotifications,
        markAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
