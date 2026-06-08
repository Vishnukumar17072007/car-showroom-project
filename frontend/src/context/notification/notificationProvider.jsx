import { useState, useCallback } from "react";
import toast from "react-hot-toast";

import API from "../../api/axios";
import { NotificationContext } from "./notificationContext";
import { useEffect } from "react";

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(true);
  
    const fetchNotifications = useCallback(async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
      }
      catch {
        setNotifications([]);
      }
      finally {
        setNotifLoading(false);
      }
    }, []);
  
    const markAsRead = async (id) => {
      try {
        await API.put(`/notifications/${id}`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      } catch {
        toast.error("Failed to mark as read.");
      }
    };

    const clearNotifications = async () => {
      try {
        await API.put(`/notifications/clear`);
        setNotifications([]);
      }catch {
        toast.error('failed to clear notifications');
      }
    }

    useEffect(() => {
      fetchNotifications();
    }, [fetchNotifications]);
  
    const unreadCount = notifications.filter((n) => !n.read).length;
  
    return (
      <NotificationContext.Provider
        value={{ notifications, notifLoading, fetchNotifications, markAsRead, clearNotifications, unreadCount }}
      >
        {children}
      </NotificationContext.Provider>
    );
};