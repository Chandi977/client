import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useUser();

  if (loading) {
    // While the user's status is being checked, show a loading indicator.
    // This prevents the premature redirect to /login.
    return (
      <div className="w-full text-center p-6">Loading user session...</div>
    );
  }

  // If loading is complete and the user is not logged in, redirect to the login page.
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
