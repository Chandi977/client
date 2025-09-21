import { useState, useEffect } from "react";
import { getWatchHistory } from "./lib/api";
import VideoCard from "./components/VideoCard";
import { useUser } from "./components/UserContext";

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
        // The API seems to return history items which contain the video object
        setVideos(response.data.map((item) => item.video) || []);
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
          videos.map(
            (video) =>
              video && (
                <VideoCard
                  key={video._id}
                  videoId={video._id}
                  {...video}
                  variant="horizontal"
                />
              )
          )
        ) : (
          <p>Your watch history is empty.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
