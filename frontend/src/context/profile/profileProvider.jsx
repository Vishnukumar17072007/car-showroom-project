import { useState } from "react";
import toast from "react-hot-toast";
import {apiGet, apiPost, apiPut} from "../../api/axios";
import ProfileContext from "./profileContext";
import { useAuth } from "../auth/useAuth"

function ProfileProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [profilePhotoSuccess, setProfilePhotoSuccess] = useState("");
    const [profilePhotoError, setProfilePhotoError] = useState("");
    const [wishListCount, setWishListCount] = useState(0);
    const [cartCount, setcartCount] = useState(0);
    const [orderCount, setorderCount] = useState(0);

    const { checkUser } = useAuth();

    function clearMessages() {
        setProfilePhotoSuccess("");
        setProfilePhotoError("");
    }

    async function updateProfile(data) {
        clearMessages();
        setLoading(true);

        try {
            const res = await apiPut('/profile/update', data);
            checkUser();

            toast.success(res?.message || "Profile updated successfully!");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed. Please try again.");
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function uploadPhoto(file) {
            clearMessages();
            setLoading(true);
        try {
            const formData = new FormData();
            formData.append("photo", file);
    
            const res = await apiPost("/profile/upload-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            setProfilePhotoSuccess(res?.message);
            return true;
        } catch (err) {
            setProfilePhotoError(err.response?.data?.message || "Profile Photo upload was failed.");
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function WLCOCount(){ // WLCO stands for WishList, Cart, Order Count
        try {
            const wishListRes = await apiGet("/dashboard/wishlist-count");
            const cartRes = await apiGet("/dashboard/cart-count");
            const orderRes = await apiGet("/dashboard/order-stats");

            setWishListCount(wishListRes.count ?? 0);
            setcartCount(cartRes.count ?? 0);
            setorderCount(orderRes.count ?? 0);
        }
        catch{
            // if count apis fail then the state set to 0
        }


    }

    return (
        <ProfileContext.Provider value={{ loading, profilePhotoSuccess, profilePhotoError, clearMessages, updateProfile, uploadPhoto, WLCOCount, wishListCount, cartCount, orderCount }}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;