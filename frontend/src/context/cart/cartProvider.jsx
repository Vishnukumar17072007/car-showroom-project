import { useState } from "react";
import { CartContext } from "./cartContext";
import toast from "react-hot-toast";
import { apiDelete, apiGet, apiPost } from "../../api/axios";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const getCart = async () => {
    setCartLoading(true);
    try {
      const data = await apiGet("/cart");
      setCartItems(data?.items || []);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }

  const addToCart = async (carIdOrCar) => {
    const car =
      typeof carIdOrCar === "string" ? { _id: carIdOrCar } : carIdOrCar;

    const previousItems = cartItems;

    try {
      setCartLoading(true);
      setCartItems((prev) => [...prev, { carId: {_id: car._id} }]);

      await apiPost("/cart", {carId: car._id});

      toast.success("Added to Cart!");
    } catch (err) {

      setCartItems(previousItems);
      toast.error(err.response?.data?.message || "Failed to add to cart");
      throw err;
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (carIdOrCar) => {
    const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;
    const previousItems = cartItems;
    try {
      setCartLoading(true);
      setCartItems((prev) =>
        prev.filter((item) => {
          const itemId = item.carId?._id ?? item.carId;

          return itemId?.toString() !== carId;
        }),
      );
      await apiDelete(`/cart/${carId}`);
      setCartLoading(false);
      toast.success("Removed from Cart.");
    } catch (err) {
      setCartLoading(false);
      setCartItems(previousItems);
      toast.error(err.response?.data?.message || "Failed to remove from cart");
      throw err;
    }
  };

  const isInCart = (carIdOrCar) => {
    const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;

    if (!carId) return false;

    const carIdStr = carId.toString();

    return cartItems.some((item) => {
      const itemId = typeof item?.carId === "object" 
        ? item?.carId?._id 
        : item?.carId;
      return itemId?.toString() === carIdStr.toString();
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        getCart,
        addToCart,
        removeFromCart,
        isInCart,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
