import { useState } from "react";
import WishListContext from "./wishListContext";
import { AuthContext } from "../auth/authContext";
import { useContext, useCallback } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function WishListProvider({children}){
    const { user } = useContext(AuthContext);
    const [wishListItems, setWishListItems] = useState([]);
    const [wishListLoading, setWishListLoading] = useState(false);

    const normalizeWishList = (data) => {
        // Backend returns: { items: [{ carId: <Car doc populated> }, ...] }
        // UI expects: array of car docs.
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
            const res = await fetch("/api/wishlist", { credentials: "include" });
            const data = await res.json();
            setWishListItems(normalizeWishList(data));
        } finally {
            setWishListLoading(false);
        }
    }, [user]);


    useEffect(() => {
        if (!user) {
            // Avoid synchronous setState inside effect (keeps React lint quiet)
            Promise.resolve().then(() => setWishListItems([]));
            return;
        }
        // Defer to avoid "setState in effect" warnings.
        Promise.resolve().then(() => refreshWishList());
    }, [user, refreshWishList]);

    const addToWishList = async(carId) => {
        await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({carId})
        });
        toast.success("Added to Wish List!")
        // Re-fetch to ensure `items.carId` is populated (image/details).
        await refreshWishList();
    }

    const removeFromWishList = async(carId) => {
        await fetch(`/api/wishlist/${carId}`, {
            method: "DELETE",
            credentials: "include"
        });
        toast.success("Removed from Wish List.")
        // Re-fetch to ensure `items.carId` is populated (image/details).
        await refreshWishList();
    }

    const isInWishList = (carId) => {
        const carIdStr = carId?.toString?.() ?? carId;
        return wishListItems.some(car => car?._id?.toString() === carIdStr);
    };

    return (
        <WishListContext.Provider value={{wishListItems, addToWishList, removeFromWishList, isInWishList, wishListLoading}}>
            {children}
        </WishListContext.Provider>
    );
}