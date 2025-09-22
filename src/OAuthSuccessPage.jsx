import { useEffect } from "react";

const OAuthSuccessPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userStr = params.get("user");

    if (window.opener && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        // The backend has already set the httpOnly cookie.
        // We send the user object to the main window to update the UI immediately.
        window.opener.postMessage({ user }, window.location.origin);
      } catch (error) {
        // Handle potential JSON parsing errors
        window.opener.postMessage(
          { error: "Failed to parse user data." },
          window.location.origin
        );
      } finally {
        // Close the popup window once the message is sent
        window.close();
      }
    } else if (window.opener) {
      // Handle case where user data is not in the URL
      window.opener.postMessage(
        { error: "Authentication failed. No user data received." },
        window.location.origin
      );
      window.close();
    }
  }, []);

  if (!window.opener) {
    return (
      <div className="p-6 text-center">
        Authentication successful! You can now close this tab.
      </div>
    );
  }

  return <div className="p-6 text-center">Authenticating... Please wait.</div>;
};

export default OAuthSuccessPage;
