import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "../context/auth/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          sameSite: "None",
        });

        try {
          await checkAuth();         // ← re-fetch /auth/me so user state is set
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

  return <p>Signing you in...</p>;
}