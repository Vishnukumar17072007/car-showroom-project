import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { RoutePageSkeleton } from "./PageSkeletons";

function AdminRoute() {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return <RoutePageSkeleton />;
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
