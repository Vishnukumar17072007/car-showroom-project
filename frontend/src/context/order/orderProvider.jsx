import { useState, useEffect, useCallback } from "react";
import { OrderContext } from "./orderContext";
import { useAuth } from "../auth/useAuth";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const { user } = useAuth();

    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true);
        if (!user) {
            setOrders([]);
            setOrdersLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/order`, { credentials: 'include' });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch {
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const placeOrder = async (shippingDetails, carIds) => {
        const res = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ shippingDetails, carIds })  // ← carIds added
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || 'Failed to place order.');
        } else {
            toast.success("Order placed successfully! 🎉");
        }
        await fetchOrders();
        return data;
    };

    const cancelOrder = async (orderId) => {
        const res = await fetch(`${API_URL}/order/cancel/${orderId}`, {
            method: 'PATCH',
            credentials: 'include',
        });
        const data = await res.json();
        if(!res.ok){
            toast.error(data.message || 'Failed to cancel order.');
            throw new Error(data.message || 'Failed to cancel order.');
        }
        else{
            toast.success("Order cancelled");
        }
        await fetchOrders()
    }

    const deleteOrder = async (orderId) => {
        const res = await fetch(`${API_URL}/order/delete/${orderId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) {
            toast.error(data.message || 'Failed to Delete order history.');
            throw new Error(data.message || 'Failed to Delete order history.');
        } else {
            toast.success("Order history Deleted.");
        }
        await fetchOrders();   // re-sync orders list from DB
    };

    return (
        <OrderContext.Provider value={{ orders, placeOrder, fetchOrders, deleteOrder, cancelOrder, ordersLoading }}>
            {children}
        </OrderContext.Provider>
    );
};