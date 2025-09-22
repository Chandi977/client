import { useEffect } from "react";

const OAuthSuccessPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataStr = params.get("data"); // Expect a 'data' param with user and token

    if (window.opener && dataStr) {
      try {
        const data = JSON.parse(decodeURIComponent(dataStr));
        // Send the entire data object (user + token) to the main window
        window.opener.postMessage({ data }, window.location.origin);
      } catch (error) {
        // Handle potential JSON parsing errors
        window.opener.postMessage(
          { error: "Failed to parse authentication data." },
          window.location.origin
        );
      } finally {
        // Close the popup window once the message is sent
        window.close();
      }
    } else if (window.opener) {
      // Handle case where data is not in the URL
      window.opener.postMessage(
        { error: "Authentication failed. No data received." },
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
