import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ThumbsUp, Share2, Download, ListPlus } from "lucide-react";
import toast from "react-hot-toast";
import VideoCard from "./components/VideoCard";
import Comments from "./components/Comments";
import AddToPlaylistModal from "./components/AddToPlaylistModal";
import * as api from "./lib/api";
import { useUser } from "./components/UserContext";
import VideoPlayer from "./components/VideoPlayer";

const VideoDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const { user, isLoggedIn, loading: userLoading } = useUser();
  const [viewRecorded, setViewRecorded] = useState(false);
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  const handleRecordView = async () => {
    if (!isLoggedIn || !video?._id || viewRecorded) return;
    try {
      await api.recordView(video._id);
      setViewRecorded(true);

      // Optimistic UI update
      setVideo((prev) =>
        prev ? { ...prev, views: (prev.views || 0) + 1 } : prev
      );
    } catch (err) {
      console.error("Failed to record view:", err);
    }
  };

  const fetchVideoData = useCallback(async () => {
    if (!id || userLoading) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch critical data first.
      const [videoRes, allVideosRes] = await Promise.all([
        api.getVideoById(id),
        api.getAllVideos({ limit: 10 }),
      ]);

      setVideo(videoRes?.data?.data || null);
      setRecommendedVideos(
        allVideosRes?.data?.data?.videos?.filter((v) => v._id !== id) || []
      );
    } catch (err) {
      setError("Failed to load video details.");
    } finally {
      setLoading(false);
    }
  }, [id, userLoading]);

  useEffect(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  // Effect to check if the video is liked by the current user
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (isLoggedIn && video) {
        try {
          const likedVideosRes = await api.getLikedVideos();
          const isLiked = likedVideosRes.data.data.some(
            (v) => v._id === video._id
          );
          setVideo((prev) => (prev ? { ...prev, isLiked } : prev));
        } catch (error) {
          console.error("Failed to check like status", error);
        }
      }
    };
    checkLikeStatus();
  }, [isLoggedIn, video?._id]);

  const handleNextVideo = () => {
    if (recommendedVideos.length > 0) {
      navigate(`/video/${recommendedVideos[0]._id}`);
    } else {
      toast("No next video available.");
    }
  };

  const handlePreviousVideo = () => {
    toast("No previous video in this context.");
  };

  const handleToggleSubscription = async () => {
    if (!isLoggedIn || !video?.owner?._id || user?._id === video.owner._id) {
      toast.error("Cannot subscribe.");
      return;
    }

    setVideo((prev) => {
      if (!prev) return null;
      const newIsSubscribed = !prev.isSubscribed;
      const newSubscribersCount = newIsSubscribed
        ? prev.owner.subscribersCount + 1
        : prev.owner.subscribersCount - 1;
      return {
        ...prev,
        isSubscribed: newIsSubscribed,
        owner: { ...prev.owner, subscribersCount: newSubscribersCount },
      };
    });

    try {
      await api.toggleSubscription(video.owner._id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle subscription");
      // Revert UI on failure
      setVideo((prev) => {
        if (!prev) return null;
        const newIsSubscribed = !prev.isSubscribed;
        const newSubscribersCount = newIsSubscribed
          ? prev.owner.subscribersCount + 1
          : prev.owner.subscribersCount - 1;
        return {
          ...prev,
          isSubscribed: newIsSubscribed,
          owner: { ...prev.owner, subscribersCount: newSubscribersCount },
        };
      });
    }
  };

  const handleToggleVideoLike = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to like a video.");
      return;
    }

    const originalVideo = { ...video };

    // Optimistic UI update
    setVideo((prev) => {
      if (!prev) return null;
      const newIsLiked = !prev.isLiked;
      const currentLikes = prev.likesCount || 0;
      const newLikesCount = newIsLiked ? currentLikes + 1 : currentLikes - 1;
      return { ...prev, isLiked: newIsLiked, likesCount: newLikesCount };
    });

    try {
      await api.toggleVideoLike(id);
      // Optimistic update is sufficient since the API does not return the new count.
    } catch (err) {
      console.error(err);
      toast.error("Failed to update like status.");
      // Revert UI on failure
      setVideo(originalVideo);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!video) return <div className="p-6 text-center">Video not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row p-4 md:p-6 gap-6">
      <div className="w-full lg:flex-1 min-w-0">
        <div className="aspect-video bg-black rounded-xl mb-4 overflow-hidden">
          <VideoPlayer
            src={video.videoFile?.url || video.videoFile}
            poster={video.thumbnail?.url}
            onPlay={handleRecordView}
            onNext={handleNextVideo}
            onPrevious={handlePreviousVideo}
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              to={`/channel/${video.owner?.username}`}
              className="flex items-center gap-3"
            >
              <img
                src={video.owner?.avatar || null}
                alt={video.owner?.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{video.owner?.username}</p>
                <p className="text-sm text-gray-400">
                  {video.owner?.subscribersCount} subscribers
                </p>
              </div>
            </Link>
            <button
              onClick={handleToggleSubscription}
              className={`px-4 py-2 rounded-full font-semibold ${
                video.isSubscribed
                  ? "bg-gray-700 text-white"
                  : "bg-white text-black"
              }`}
            >
              {video.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
            <button
              onClick={handleToggleVideoLike}
              className={`flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 ${
                video.isLiked ? "text-blue-500" : ""
              }`}
            >
              <ThumbsUp size={20} /> {video.likesCount || 0}
            </button>
            <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700">
              <Share2 size={20} /> Share
            </button>
            <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700">
              <Download size={20} /> Download
            </button>
            <button
              onClick={() => setIsPlaylistModalOpen(true)}
              className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700"
            >
              <ListPlus size={20} /> Save
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl">
          <p className="font-semibold">
            {video.views || 0} views &bull;{" "}
            {video.createdAt
              ? new Date(video.createdAt).toLocaleDateString()
              : ""}
          </p>
          <p className="mt-2">{video.description}</p>
        </div>

        <Comments videoId={id} videoOwnerId={video.owner?._id} />
      </div>

      <div className="w-full lg:w-96 lg:flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">Up next</h2>
        <div className="flex flex-col gap-4">
          {recommendedVideos.map((recVideo, idx) => (
            <VideoCard
              key={recVideo._id || idx}
              variant="horizontal"
              videoId={recVideo._id}
              thumbnail={recVideo.thumbnail?.url}
              title={recVideo.title}
              channel={recVideo.owner?.username}
              channelAvatar={recVideo.owner?.avatar}
              views={recVideo.views}
              timestamp={recVideo.createdAt}
            />
          ))}
        </div>
      </div>
      {isPlaylistModalOpen && (
        <AddToPlaylistModal
          videoId={id}
          onClose={() => setIsPlaylistModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VideoDetailPage;
