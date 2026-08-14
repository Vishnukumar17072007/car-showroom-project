import { useState } from "react";
import toast from "react-hot-toast";

import { apiGet, apiPatch, apiPost, apiPut } from "../../api/axios";
import { OrderContext } from "./orderContext";

export const OrderProvider = ({ children }) => {


    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const getOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await apiGet('/order');
            setOrders(Array.isArray(res) ? res : []);
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
            const res = await apiPost('/order', { shippingDetails, carId });
            toast.success("Order placed successfully!");
            await getOrders();
            return res;
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to place order.';
            toast.error(message);
            throw new Error(message);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const res = await apiPatch(`/order/cancel/${orderId}`);
            toast.success(res?.message || "Order cancelled");
            await getOrders();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to cancel order.';
            toast.error(message);
            throw new Error(message);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const res = await apiPatch(`/order/soft-delete/${orderId}`);
            toast.success(res?.message || "Order deleted");
            await getOrders();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete order.';
            toast.error(message);
            throw new Error(message);
        }
    };

    const changeStatus = async (orderId, newStatus) => {
        try {
            const res = await apiPut(`/order/${orderId}/status`, { status: newStatus });
            toast.success(res?.message || `Order marked as ${newStatus}`);
            await getOrders();
        }
        catch (err) {
            const message = err.response?.data?.message || "failed to change the status.";
            toast.error(message);
        }
    }

    return (
        <OrderContext.Provider value={{ orders, getOrders, placeOrder, deleteOrder, cancelOrder, changeStatus, ordersLoading }}>
            {children}
        </OrderContext.Provider>
    );
};
