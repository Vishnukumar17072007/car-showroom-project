import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
import { AuthCallbackSkeleton } from "./PageSkeletons";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token);  // ← store in localStorage

        try {
          await checkAuth();
          navigate("/dashboard", { replace: true });
        } catch {
          navigate("/login", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    }

    handleCallback();
  }, []);

  return <AuthCallbackSkeleton />;
}