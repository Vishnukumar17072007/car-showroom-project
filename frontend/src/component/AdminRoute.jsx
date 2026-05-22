import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

function AdminRoute() {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
