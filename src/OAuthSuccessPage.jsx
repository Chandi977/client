import { useEffect } from "react";

const OAuthSuccessPage = () => {
  useEffect(() => {
    // This page is loaded in the popup window after a successful OAuth login.
    // The backend has already set the necessary httpOnly cookies.
    // Now, we need to notify the main application window that the login was successful
    // so it can update its state (e.g., fetch user data) and close this popup.

    if (window.opener) {
      // Send a message to the parent window.
      // The parent window (LoginPage/RegisterPage) is listening for this.
      window.opener.postMessage({ oauthSuccess: true }, window.location.origin);
      // The parent window will be responsible for closing the popup.
    }
  }, []);

  return <div className="p-6 text-center">Authenticating... Please wait.</div>;
};

export default OAuthSuccessPage;
