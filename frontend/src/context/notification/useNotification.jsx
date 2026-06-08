import { useContext } from "react";
import { NotificationContext } from "./notificationContext";

export const useNotification = () => useContext(NotificationContext);