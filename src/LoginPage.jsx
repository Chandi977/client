import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./lib/api";
import { useUser } from "./components/UserContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLoginSuccess } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginUser({ email, password });
      handleLoginSuccess(response.data.user);
      toast.success("Logged in successfully!");
      navigate("/"); // Redirect to home on success
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Open OAuth popup
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const handleMessage = (event) => {
      // IMPORTANT: Check the origin of the message for security
      if (event.origin !== window.location.origin) {
        return;
      }

      const { user, error } = event.data;

      if (user) {
        handleLoginSuccess(user);
        toast.success("Logged in successfully!");
        navigate("/");
      } else if (error) {
        toast.error(error);
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

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-[#0f0f0f]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#121212] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Login with Google
          </button>
          <button
            onClick={() => handleOAuthLogin("github")}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-gray-900"
          >
            Login with GitHub
          </button>
        </div>

        <p className="text-sm text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
