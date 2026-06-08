import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

function ProtectedRoutes(){

    const { user, authLoading } = useAuth();

    if(authLoading){
        return <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status" />
        </div>
    }

    if(!user){
        return <Navigate to="/login" replace />
    }

    return <Outlet />;

}

export default ProtectedRoutes;