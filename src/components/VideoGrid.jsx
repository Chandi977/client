import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import { getAllVideos } from "../lib/api";

const VideoGrid = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Fetch more videos by setting a higher limit
        const response = await getAllVideos({ limit: 20 });
        // The actual videos are in response.data.data.videos
        setVideos(response.data.data.videos || []);
      } catch (err) {
        setError("Failed to fetch videos. Make sure your backend is running.");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading)
    return <div className="flex-1 p-6 text-center">Loading videos...</div>;
  if (error)
    return <div className="flex-1 p-6 text-center text-red-500">{error}</div>;

  return (
    <main className="flex-1 p-4 sm:p-6 bg-[#0f0f0f]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {videos.map((video, index) => (
          <VideoCard
            key={video._id || index}
            videoId={video._id}
            thumbnail={video.thumbnail}
            channelAvatar={video.owner?.avatar}
            title={video.title}
            channel={video.owner?.username}
            views={video.views}
            timestamp={video.createdAt}
            owner={video.owner}
          />
        ))}
      </div>
    </main>
  );
};

export default VideoGrid;
