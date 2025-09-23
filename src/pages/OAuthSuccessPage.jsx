import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import Cookies from "js-cookie";

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token"); // token from backend
    const userData = params.get("user"); // optional user info from backend

    if (token) {
      try {
        const user = userData ? JSON.parse(decodeURIComponent(userData)) : null;

        if (user) {
          handleLoginSuccess(user); // Update context with user info
        }

        // Set token in cookie (expires in 7 days)
        Cookies.set("authToken", token, { expires: 7 });

        // Use postMessage to communicate with the opener window, which is more reliable
        // than reloading and allows for a cleaner UX.
        if (window.opener) {
          window.opener.postMessage(
            { oauthSuccess: true },
            window.location.origin
          );
          window.close();
        } else {
          navigate("/"); // Fallback redirect if there's no opener
        }
      } catch (err) {
        console.error("Failed to process OAuth success:", err);
        navigate("/login"); // Redirect to login on error
      }
    } else {
      // If no token is found, redirect to login
      navigate("/login");
    }
  }, []);

  return (
    <div className="p-6 text-center">
      Processing authentication... Please wait.
    </div>
  );
};

export default OAuthSuccessPage;
