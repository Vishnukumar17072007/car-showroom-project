import { useState, useContext, useCallback, useEffect } from "react";
import WishListContext from "./wishListContext";
import { AuthContext } from "../auth/authContext";
import toast from "react-hot-toast";
import API from "../../api/axios";

export function WishListProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishListItems, setWishListItems] = useState([]);
  const [wishListLoading, setWishListLoading] = useState(false);

  const normalizeWishList = (data) => {
    const items = data?.items || [];
    return items.map((x) => x?.carId).filter(Boolean);
  };

  const refreshWishList = useCallback(async () => {
    setWishListLoading(true);
    if (!user) {
      setWishListItems([]);
      setWishListLoading(false);
      return;
    }
    try {
      const res = await API.get("/wishlist");
      setWishListItems(normalizeWishList(res.data));
    } catch {
      setWishListItems([]);
    } finally {
      setWishListLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setWishListItems([]);
      return;
    }
    refreshWishList();
  }, [user, refreshWishList]);

  const addToWishList = async (carOrCarId) => {
    const car =
      typeof carOrCarId === "string" ? { _id: carOrCarId } : carOrCarId;

    const previousItems = wishListItems;

    try {
      setWishListItems((prev) => [...prev, car]);

      await API.post("/wishlist", {
        carId: car._id,
      });

      toast.success("Added to Wish List!");
    } catch (err) {
      setWishListItems(previousItems);

      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const removeFromWishList = async (carIdOrCar) => {
    const carId = typeof carIdOrCar === "string" ? carIdOrCar : carIdOrCar?._id;

    const previousItems = wishListItems;

    try {
      setWishListItems((prev) =>
        prev.filter((car) => car?._id?.toString() !== carId.toString()),
      );

      await API.delete(`/wishlist/${carId}`);

      toast.success("Removed from Wish List.");
    } catch (err) {
      setWishListItems(previousItems);

      toast.error(
        err.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  };

  const isInWishList = (carId) => {
    const carIdStr = carId?.toString?.() ?? carId;
    return wishListItems.some((car) => car?._id?.toString() === carIdStr);
  };

  return (
    <WishListContext.Provider
      value={{
        wishListItems,
        addToWishList,
        removeFromWishList,
        isInWishList,
        wishListLoading,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}
