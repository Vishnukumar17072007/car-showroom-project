import { useState } from "react";
import AdminOrders from "./AdminOrders";
import UserOrders from "./UserOrders";
import { useAuth } from "../context/auth/useAuth";

function Orders() {

    const { user } = useAuth();

    const [ordersTab, setOrdersTab] = useState("userOrders");

    return (
        <div className="OrderPage">
            {user?.role === "admin" && (
                <div className="OrderAccessTab">
                    <button
                        className={`order-tab-btn ${ordersTab === "userOrders" ? "active" : ""}`}
                        onClick={() => setOrdersTab("userOrders")}
                    >
                        My Orders
                    </button>
                    <button
                        className={`order-tab-btn ${ordersTab === "adminOrders" ? "active" : ""}`}
                        onClick={() => setOrdersTab("adminOrders")}
                    >
                        All Orders
                    </button>
                </div>
            )}
    
            {ordersTab === "userOrders" && <UserOrders />}
            {ordersTab === "adminOrders" && <AdminOrders />}
        </div>
    );
}

export default Orders;