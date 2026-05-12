import { useState, useEffect, useCallback } from "react";
import { CartContext } from "./cartContext";
import { useAuth } from "../auth/useAuth";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    const fetchCart = useCallback(async () => {        // ← NEW
        setCartLoading(true);
        if (!user) {
            setCartItems([]);
            setCartLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/cart`, { credentials: "include" });
            const data = await res.json();
            setCartItems(data.items || data.item || []);
        } finally {
            setCartLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (carIdOrCar) => {
        const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;
        const res = await fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ carId })
        });
        const data = await res.json();
        toast.success("Added to Cart!");
        setCartItems(data?.items || []);
    };

    const removeFromCart = async (carIdOrCar) => {
        const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;
        const res = await fetch(`${API_URL}/cart/${carId}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await res.json();
        toast.success("Removed from Cart.");
        setCartItems(data?.items || []);
    };

    const isInCart = (carIdOrCar) => {
        const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;
        if (!carId) return false;
        const carIdStr = carId.toString();
        return cartItems.some(item => item?.carId?._id?.toString() === carIdStr);
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart, isInCart, fetchCart, cartLoading }}>
            {children}
        </CartContext.Provider>
    );
}