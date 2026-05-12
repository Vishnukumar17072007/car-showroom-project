import { useContext } from "react";
import wishListContext from "./wishListContext";

export function useWishList(){
    return useContext(wishListContext);
}