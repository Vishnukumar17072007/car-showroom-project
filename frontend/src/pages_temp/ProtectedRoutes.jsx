import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { RoutePageSkeleton } from "./PageSkeletons";

function ProtectedRoutes(){

    const { user, authLoading } = useAuth();

    if(authLoading){
        return <RoutePageSkeleton />;
    }

    if(!user){
        return <Navigate to="/login" replace />
    }

    return <Outlet />;

}

export default ProtectedRoutes;