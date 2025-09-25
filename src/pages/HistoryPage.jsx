import { useState, useEffect } from "react";
import { getWatchHistory } from "../lib/api";
import VideoCard from "../components/VideoCard";
import { useUser } from "../components/UserContext";

const HistoryPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: userLoading, isLoggedIn } = useUser();

  useEffect(() => {
    if (userLoading) return;
    if (!isLoggedIn) return; // Also ensure user is logged in
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getWatchHistory();
        setVideos(response.data.data || []);
      } catch (err) {
        setError(
          "Failed to fetch watch history. Please make sure you are logged in."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userLoading, isLoggedIn]);

  if (loading) return <div className="p-6 text-center">Loading History...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-[calc(100vh-3.5rem)]">
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>
      <div className="flex flex-col gap-4">
        {videos.length > 0 ? (
          videos.map((historyItem) => {
            const video = historyItem.video;
            return (
              video && (
                <VideoCard
                  key={historyItem._id} // Use history item's _id for the key
                  videoId={video._id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  views={video.views}
                  timestamp={video.createdAt}
                  channel={video.owner?.username} // Explicitly pass the username
                  channelAvatar={video.owner?.avatar}
                  variant="horizontal"
                />
              )
            );
          })
        ) : (
          <p>Your watch history is empty.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
