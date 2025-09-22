import {
  Home,
  History,
  Video,
  ThumbsUp,
  ListVideo,
  Users,
  TrendingUp,
  Radio,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

const Sidebar = ({ isOpen }) => {
  const { isLoggedIn } = useUser();

  const mainLinks = [
    { icon: <Home />, text: "Home", to: "/" },
    { icon: <TrendingUp />, text: "Trending", to: "/trending" },
    { icon: <Radio />, text: "Live", to: "/live" },
    { icon: <Users />, text: "Subscriptions", to: "/subscriptions" },
  ];

  const libraryLinks = [
    { icon: <History />, text: "History", to: "/history" },
    { icon: <Video />, text: "Your Videos", to: "/dashboard" }, // Assuming dashboard shows user's videos
    { icon: <ThumbsUp />, text: "Liked Videos", to: "/liked-videos" },
    { icon: <ListVideo />, text: "Library", to: "/library" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-60 h-screen bg-[#0f0f0f]/80 backdrop-blur-lg text-white p-4 transition-transform duration-300 ease-in-out 
      lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0
      ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } overflow-y-auto pt-20 lg:pt-4`}
    >
      <nav className="space-y-2">
        {mainLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800"
          >
            {link.icon}
            <span className="font-medium">{link.text}</span>
          </Link>
        ))}
      </nav>
      {isLoggedIn && (
        <>
          <hr className="my-4 border-gray-700" />
          <nav className="space-y-2">
            <h2 className="px-2 text-lg font-semibold">You</h2>
            {libraryLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800"
              >
                {link.icon}
                <span className="font-medium">{link.text}</span>
              </Link>
            ))}
          </nav>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
