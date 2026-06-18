import { useState, useCallback } from "react";
import toast from "react-hot-toast";

import API from "../../api/axios";
import { OrderContext } from "./orderContext";
import { useAuth } from "../auth/useAuth";
import { useNotification } from '../notification/useNotification';

export const OrderProvider = ({ children }) => {

    const { user } = useAuth();
    const { fetchNotifications } = useNotification();

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true);
        if (!user) {
            setOrders([]);
            setOrdersLoading(false);
            return;
        }
        try {
            const res = await API.get('/order');
            setOrders(Array.isArray(res.data) ? res.data : []);
            await fetchNotifications();
        } catch {
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    }, [user]);

    const getOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await API.get('/order');
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch {
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const placeOrder = async (form, carId) => {
        const shippingDetails = {
            name: form.name,
            mobile: Number(form.phone),
            address: form.address,
            city: form.city,
            pincode: Number(form.pincode),
        };

        try {
            const res = await API.post('/order', { shippingDetails, carId });
            toast.success("Order placed successfully!");
            await fetchOrders();
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to place order.';
            toast.error(message);
            throw new Error(message);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const res = await API.patch(`/order/cancel/${orderId}`);
            toast.success(res.data?.message || "Order cancelled");
            await fetchOrders();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to cancel order.';
            toast.error(message);
            throw new Error(message);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const res = await API.patch(`/order/soft-delete/${orderId}`);
            toast.success(res.data?.message || "Order deleted");
            await fetchOrders();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete order.';
            toast.error(message);
            throw new Error(message);
        }
    };

    const changeStatus = async (orderId, newStatus) => {
        try {
            const res = await API.put(`/order/${orderId}/status`, { status: newStatus });
            toast.success(res.data?.message || `Order marked as ${newStatus}`);
            await fetchOrders();
        }
        catch (err) {
            const message = err.response?.data?.message || "failed to change the status.";
            toast.error(message);
        }
    }

    return (
        <OrderContext.Provider value={{ orders, getOrders, placeOrder, fetchOrders, deleteOrder, cancelOrder, changeStatus, ordersLoading }}>
            {children}
        </OrderContext.Provider>
    );
};
