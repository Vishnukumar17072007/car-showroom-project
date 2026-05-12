import { useContext } from "react";
import { OrderContext } from "./orderContext";

export function useOrder(){
    return useContext(OrderContext);
}