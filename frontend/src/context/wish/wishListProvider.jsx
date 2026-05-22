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
        return items.map(x => x?.carId).filter(Boolean);
    };

    const refreshWishList = useCallback(async () => {
        setWishListLoading(true);
        if (!user) {
            setWishListItems([]);
            setWishListLoading(false);
            return;
        }
        try {
            const res = await API.get('/wishlist');
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

    const addToWishList = async (carId) => {
        try {
            await API.post('/wishlist', { carId });
            toast.success("Added to Wish List!");
            await refreshWishList();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add to wishlist");
        }
    };

    const removeFromWishList = async (carId) => {
        try {
            await API.delete(`/wishlist/${carId}`);
            toast.success("Removed from Wish List.");
            await refreshWishList();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove from wishlist");
        }
    };

    const isInWishList = (carId) => {
        const carIdStr = carId?.toString?.() ?? carId;
        return wishListItems.some(car => car?._id?.toString() === carIdStr);
    };

    return (
        <WishListContext.Provider value={{ wishListItems, addToWishList, removeFromWishList, isInWishList, wishListLoading }}>
            {children}
        </WishListContext.Provider>
    );
}
