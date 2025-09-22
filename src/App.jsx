import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AOS from "aos";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import VideoGrid from "./components/VideoGrid";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import VideoDetailPage from "./VideoDetailPage";
import LikedVideosPage from "./LikedVideosPage";
import HistoryPage from "./HistoryPage";
import SearchResultsPage from "./SearchResultsPage";
import ChannelPage from "./ChannelPage";
import DashboardPage from "./DashboardPage";
import LibraryPage from "./LibraryPage";
import PlaylistDetailPage from "./PlaylistDetailPage";
import SubscriptionsPage from "./SubscriptionsPage";
import TrendingPage from "./TrendingPage";
import OAuthSuccessPage from "./OAuthSuccessPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 1024
  );

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true, // Animate elements only once
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar isOpen={isSidebarOpen} />
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={toggleSidebar}
            ></div>
          )}
          <main className="flex-1 overflow-y-auto z-10">
            <Routes>
              <Route path="/" element={<VideoGrid />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/oauth-success" element={<OAuthSuccessPage />} />
              <Route path="/video/:id" element={<VideoDetailPage />} />
              <Route path="/liked-videos" element={<LikedVideosPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/results" element={<SearchResultsPage />} />
              <Route path="/channel/:username" element={<ChannelPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route
                path="/playlist/:playlistId"
                element={<PlaylistDetailPage />}
              />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/trending" element={<TrendingPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
