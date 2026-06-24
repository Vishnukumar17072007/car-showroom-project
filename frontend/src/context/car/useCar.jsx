import { useContext } from "react";
import { carContext } from "./carContext";

export function useCar() {
    return useContext(carContext);
}