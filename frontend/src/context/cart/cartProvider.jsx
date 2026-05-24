import { useState, useEffect, useCallback } from "react";
import { CartContext } from "./cartContext";
import { useAuth } from "../auth/useAuth";
import toast from "react-hot-toast";
import API from "../../api/axios";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setCartLoading(true);
    if (!user) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }
    try {
      const data = await API.get("/cart");
      setCartItems(data.data?.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (carIdOrCar) => {
    const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;
    try {
      await API.post("/cart", { carId });
      toast.success("Added to Cart!");
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
      throw err;
    }
  };

  const removeFromCart = async (carIdOrCar) => {
    const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;
    try {
      await API.delete(`/cart/${carId}`);
      toast.success("Removed from Cart.");
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove from cart");
      throw err;
    }
  };

  const isInCart = (carIdOrCar) => {
    const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;
    if (!carId) return false;
    const carIdStr = carId.toString();
    return cartItems.some((item) => {
      const itemId =
        typeof item?.carId === "object" ? item?.carId?._id : item?.carId;
      return itemId?.toString() === carIdStr;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        isInCart,
        fetchCart,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
