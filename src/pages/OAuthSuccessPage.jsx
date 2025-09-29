import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import Cookies from "js-cookie";

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userData = params.get("user"); // optional user info

    if (accessToken) {
      try {
        const user = userData ? JSON.parse(decodeURIComponent(userData)) : null;

        if (user) {
          handleLoginSuccess(user, accessToken); // Update context with user info
        }

        // Store tokens in cookies
        Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 day
        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days
        }

        // Send postMessage to opener (popup)
        if (window.opener) {
          window.opener.postMessage(
            {
              oauthSuccess: true,
              loginResponse: {
                statusCode: 200,
                data: { user, accessToken, refreshToken },
                message: "OAuth login successful",
                success: true,
              },
            },
            window.location.origin
          );
          window.close();
        } else {
          navigate("/"); // fallback if no opener
        }
      } catch (err) {
        console.error("Failed to process OAuth success:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [handleLoginSuccess, navigate]);

  return (
    <div className="p-6 text-center">
      Processing authentication... Please wait.
    </div>
  );
};

export default OAuthSuccessPage;
