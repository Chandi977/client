import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Video,
  Bell,
  LogOut,
  History,
  ThumbsUp,
  ListVideo,
  LayoutDashboard,
  User,
  Youtube,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoggedIn, handleLogout: contextLogout } = useUser();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await contextLogout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?search_query=${searchQuery.trim()}`);
    }
  };

  return (
    <header className="flex justify-between items-center px-4 h-14 bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-800"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="flex items-center gap-1 cursor-pointer">
          <Youtube color="#FF0000" size={28} />
          <span className="text-xl font-semibold tracking-tighter">
            YouTube
          </span>
        </Link>
      </div>

      {/* Center Section */}
      <div className="hidden sm:flex flex-1 justify-center px-4">
        <form onSubmit={handleSearch} className="w-full max-w-md flex">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#121212] border border-gray-700 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-800 border border-gray-700 border-l-0 rounded-r-full px-6 hover:bg-gray-700"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Icon for mobile */}
        <button className="p-2 rounded-full hover:bg-gray-800 sm:hidden">
          <Search size={20} />
        </button>

        {isLoggedIn && (
          <Link to="/upload" className="hidden sm:block">
            <button className="p-2 rounded-full hover:bg-gray-800">
              <Video size={24} />
            </button>
          </Link>
        )}
        <button className="p-2 rounded-full hover:bg-gray-800 hidden sm:block">
          <Bell size={24} />
        </button>
        {isLoggedIn && user ? (
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
                <Link
                  to={`/channel/${user.username}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} /> Your Channel
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link
                  to="/library"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ListVideo size={18} /> Library
                </Link>
                <Link
                  to="/liked-videos"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ThumbsUp size={18} /> Liked Videos
                </Link>
                <Link
                  to="/history"
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <History size={18} /> History
                </Link>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={toggleTheme}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 border border-gray-700 px-3 py-1.5 rounded-full text-blue-400 hover:bg-blue-900/50 whitespace-nowrap">
              <User size={20} /> Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
