import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Call backend to exchange code for tokens & set cookies
      api
        .get(`/auth/google/callback?code=${code}`, { withCredentials: true })
        .then(() => {
          // Cookies now stored in browser automatically
          navigate("/"); // Redirect to home
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Logging in...</p>;
};

export default OAuthSuccess;
