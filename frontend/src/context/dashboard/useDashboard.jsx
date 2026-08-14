import { useContext } from "react";
import { DashboardContext } from "./dashboardContext";

export function useDashboard(){
    return useContext(DashboardContext);
}