import { useNotification } from "../context/notification/useNotification";
import { NotificationListSkeleton } from "../components/PageSkeletons";

const GOLD       = "#c9a84c";
const GOLD_FAINT = "rgba(201,168,76,0.12)";

const Notifications = () => {
  const { notifications, notifLoading, clearNotifications, markAsRead } = useNotification();

  if (notifLoading) return <NotificationListSkeleton />;

  return (
    <div className="cart_page">
      <h2 style={{ padding: "5px", color: "var(--text)", backgroundColor: "white", display: "flex", justifyContent: "space-between" }}>
            Notifications
            <div>
              <button onClick={() => clearNotifications()} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8,
                border: "1px solid rgba(201,168,76,0.35)", background: GOLD_FAINT,
                color: GOLD, fontSize: 12, cursor: "pointer", fontWeight: 500,
              }}>clear</button>
            </div>
          </h2>
      <div className="cart_layout">
        <div className="cart_items_scroll">
          
          {notifications.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center" style={{minHeight: "200px", gridColumn: '1 / -1'}}>
              <p style={{ fontSize: "1.2rem", color: "gray" }}>No notifications yet.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && markAsRead(n._id)}
                style={{
                  padding: "14px 16px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  cursor: n.read ? "default" : "pointer",
                  backgroundColor: n.read ? "var(--card-bg)" : "var(--gold)22",
                  border: `1px solid ${n.read ? "var(--border)" : "var(--gold)"}`,
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>

                  <img className="img" src={n.image} alt=""/>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontWeight: 600, color: "var(--text)", margin: 0 }}>{n.title}</p>
                      {!n.read && (
                        <span style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          backgroundColor: "var(--gold)", display: "inline-block",
                        }} />
                      )}
                    </div>
                    <p style={{ color: "var(--subtext)", fontSize: "13px", margin: "4px 0 0 0" }}>{n.message}</p>
                    <p style={{ color: "var(--subtext)", fontSize: "11px", margin: "6px 0 0 0" }}>
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;