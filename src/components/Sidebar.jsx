import { Home, Flame, Clapperboard, Library } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: <Home />, name: "Home", path: "/" },
    { icon: <Flame />, name: "Trending", path: "/trending" },
    { icon: <Clapperboard />, name: "Subscriptions", path: "/subscriptions" },
    { icon: <Library />, name: "Library", path: "/library" },
  ];

  return (
    <aside className="w-60 bg-[#0f0f0f] p-2 pt-4 hidden md:block">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-5 px-3 py-2 rounded-lg hover:bg-gray-800 ${
                  location.pathname === item.path ? "bg-gray-800" : ""
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
