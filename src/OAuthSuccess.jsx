import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import Cookies from "js-cookie";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token"); // token from backend
    const userData = params.get("user"); // optional user info

    if (token) {
      try {
        const user = userData ? JSON.parse(decodeURIComponent(userData)) : null;

        if (user) handleLoginSuccess(user); // Update context with user info

        // Set token in cookie (expires in 7 days)
        // Detect if running in production (https://) or localhost
        const isProduction = window.location.hostname !== "localhost";

        Cookies.set("authToken", token, {
          expires: 7,
          sameSite: isProduction ? "None" : "Lax", // "None" for cross-site in prod
          secure: isProduction, // required when SameSite=None
        });

        // Refresh parent and close popup
        if (window.opener) {
          window.opener.location.reload();
          window.close();
        } else {
          navigate("/"); // fallback redirect
        }
      } catch (err) {
        console.error("Failed to parse user data:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return <p className="text-center p-6">Logging in...</p>;
};

export default OAuthSuccess;
