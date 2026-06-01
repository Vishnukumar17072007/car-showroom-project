import { useState } from "react"
import AdminDashboard from "./AdminDashboard"
import UserDashboard from "./UserDashboard"
import { useAuth } from "../context/auth/useAuth";

function Dashboard() {

    const { user } = useAuth();

    const [dashboard, setDashboard] = useState("userDashboard");

    return (
        <div className="dashboardPage">
            {user?.role === "admin" && (
                <div className="dashboardAccessTab">
                    <button
                        className={`db-tab-btn ${dashboard === "userDashboard" ? "active" : ""}`}
                        onClick={() => setDashboard("userDashboard")}
                    >
                        User Dashboard
                    </button>
                    <button
                        className={`db-tab-btn ${dashboard === "adminDashboard" ? "active" : ""}`}
                        onClick={() => setDashboard("adminDashboard")}
                    >
                        Admin Dashboard
                    </button>
                </div>
            )}
    
            {dashboard === "userDashboard" && <UserDashboard />}
            {dashboard === "adminDashboard" && <AdminDashboard />}
        </div>
    );
}

export default Dashboard;