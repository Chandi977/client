import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import Cookies from "js-cookie";
// import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useOAuth = () => {
  const { handleLoginSuccess } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event) => {
      // IMPORTANT: Check the origin of the message for security
      if (event.origin !== window.location.origin) {
        return;
      }

      const { oauthSuccess } = event.data;

      if (oauthSuccess) {
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleLoginSuccess, navigate]);

  const handleOAuthLogin = (provider) => {
    const oauthUrl = `${BACKEND_URL}/auth/${provider}`;
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      oauthUrl,
      "_blank",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return { handleOAuthLogin };
};
