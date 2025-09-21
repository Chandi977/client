import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getUserChannelProfile,
  getUserVideos,
  toggleSubscription,
} from "./lib/api";
import { useUser } from "./components/UserContext";
import VideoCard from "./components/VideoCard";
import CommunityTab from "./components/CommunityTab";

const ChannelPage = () => {
  const { username } = useParams();
  const { user: currentUser, isLoggedIn, loading: userLoading } = useUser();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' or 'community'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username || userLoading) return;

    const fetchChannelData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileRes = await getUserChannelProfile(username);
        if (!profileRes.success || !profileRes.data) {
          throw new Error("Channel not found.");
        }
        setChannel(profileRes.data);

        // Fetch videos for this channel's user ID
        const videosRes = await getUserVideos(profileRes.data._id);
        // The API might return an object with a `videos` property
        setVideos(videosRes.data?.videos || videosRes.data || []);
      } catch (err) {
        console.error("Failed to fetch channel data:", err);
        setError(err.message || "Could not load channel.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [username, userLoading]);

  const handleToggleSubscription = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to subscribe.");
      return;
    }
    if (currentUser?._id === channel._id) {
      toast.error("You cannot subscribe to your own channel.");
      return;
    }

    // Optimistic UI update
    setChannel((prev) => ({
      ...prev,
      isSubscribed: !prev.isSubscribed,
      subscribersCount: prev.isSubscribed
        ? prev.subscribersCount - 1
        : prev.subscribersCount + 1,
    }));

    try {
      await toggleSubscription(channel._id);
    } catch (err) {
      console.error("Subscription toggle failed:", err);
      toast.error("Something went wrong.");
      // Revert UI on failure
      setChannel((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed
          ? prev.subscribersCount - 1
          : prev.subscribersCount + 1,
      }));
    }
  };

  if (loading) return <div className="p-6 text-center">Loading channel...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!channel)
    return <div className="p-6 text-center">Channel not found.</div>;

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen">
      {/* Cover Image */}
      <div className="w-full h-48 bg-gray-800">
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt={`${channel.username}'s cover`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Header */}
      <div className="px-6 py-4 flex items-center gap-6 border-b border-gray-800">
        <img
          src={channel.avatar}
          alt={channel.username}
          className="w-20 h-20 rounded-full"
        />
        <div className="flex-grow">
          <h1 className="text-2xl font-bold">{channel.fullName}</h1>
          <p className="text-gray-400">@{channel.username}</p>
          <p className="text-gray-400">
            {channel.subscribersCount} subscribers
          </p>
        </div>
        {isLoggedIn && currentUser?._id !== channel._id && (
          <button
            onClick={handleToggleSubscription}
            className={`px-4 py-2 rounded-full font-semibold ${
              channel.isSubscribed
                ? "bg-gray-700 text-white"
                : "bg-white text-black"
            }`}
          >
            {channel.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-800">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("videos")}
            className={`py-3 font-semibold border-b-2 ${
              activeTab === "videos"
                ? "border-white text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            VIDEOS
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`py-3 font-semibold border-b-2 ${
              activeTab === "community"
                ? "border-white text-white"
                : "border-transparent text-gray-400"
            }`}
          >
            COMMUNITY
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.isArray(videos) &&
              videos.map((video) => (
                <VideoCard
                  key={video._id}
                  videoId={video._id}
                  {...video}
                  owner={channel}
                />
              ))}
          </div>
        )}
        {activeTab === "community" && <CommunityTab channel={channel} />}
      </div>
    </div>
  );
};

export default ChannelPage;
