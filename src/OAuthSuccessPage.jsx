import { useEffect } from "react";

const OAuthSuccessPage = () => {
  useEffect(() => {
    if (window.opener) {
      // Refresh parent window to fetch authenticated user
      window.opener.location.reload();
      window.close();
    }
  }, []);

  return (
    <div className="p-6 text-center">
      Authentication successful! You can now close this tab.
    </div>
  );
};

export default OAuthSuccessPage;
