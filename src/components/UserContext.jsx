import { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, logoutUser } from "../lib/api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(
        "Logout failed on server, but proceeding on client.",
        error
      );
    } finally {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      // Attempt to fetch user on initial load to check for a valid session cookie
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.data);
          setIsLoggedIn(true);
        }
      } catch (error) {
        // It's okay if this fails, it just means user is not logged in.
        // No need to show an error toast here.
        console.log("No active session or session expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const value = { user, isLoggedIn, loading, handleLoginSuccess, handleLogout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
