import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import VideoGrid from "./components/VideoGrid";
import VideoDetailPage from "./VideoDetailPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import UploadPage from "./UploadPage";
import DashboardPage from "./DashboardPage";
import SearchResultsPage from "./SearchResultsPage";
import HistoryPage from "./HistoryPage";
import LikedVideosPage from "./LikedVideosPage";
import ChannelPage from "./ChannelPage";
import SubscriptionsPage from "./SubscriptionsPage";
import TrendingPage from "./TrendingPage";
import LibraryPage from "./LibraryPage";
import PlaylistDetailPage from "./PlaylistDetailPage";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  // A layout component that includes the sidebar
  const AppLayout = () => (
    <MainLayout isSidebarVisible={isSidebarVisible}>
      <Outlet />
    </MainLayout>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: { background: "#282828", color: "#fff" },
        }}
      />
      <Header onMenuClick={toggleSidebar} />
      <Routes>
        {/* Routes with sidebar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<VideoGrid />} />
          <Route path="/video/:id" element={<VideoDetailPage />} />
          <Route path="/results" element={<SearchResultsPage />} />
          <Route path="/channel/:username" element={<ChannelPage />} />
          <Route path="/trending" element={<TrendingPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/liked-videos" element={<LikedVideosPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route
              path="/playlist/:playlistId"
              element={<PlaylistDetailPage />}
            />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Route>
        </Route>
        {/* Routes without sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
