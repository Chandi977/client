import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, Share2, Download, ListPlus } from "lucide-react";
import toast from "react-hot-toast";
import VideoCard from "./components/VideoCard";
import Comments from "./components/Comments";
import AddToPlaylistModal from "./components/AddToPlaylistModal";
import * as api from "./lib/api";
import { useUser } from "./components/UserContext";
import { useDataFetching } from "./hooks/useDataFetching";

const VideoDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const { user, isLoggedIn, loading: userLoading } = useUser();
  const [viewRecorded, setViewRecorded] = useState(false);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
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

      setVideo(videoRes?.data || null);
      setRecommendedVideos(
        allVideosRes?.data?.videos?.filter((v) => v._id !== id) || []
      );

      // Fetch non-critical data (comments) separately and handle its error gracefully.
      try {
        const commentsRes = await api.getVideoComments(id);
        const populatedComments = (commentsRes?.data?.docs || []).map((c) => ({
          ...c,
          owner:
            c.owner && typeof c.owner === "object"
              ? c.owner
              : { username: "Unknown", avatar: "" },
        }));
        setComments(populatedComments);
      } catch (commentsError) {
        console.error("Failed to load comments:", commentsError);
        toast.error("Could not load comments.");
        setComments([]); // Show empty comments on failure
      }
    } catch (err) {
      setError("Failed to load video details.");
    } finally {
      setLoading(false);
    }
  }, [id, userLoading]);

  useEffect(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  const handlePostComment = async (text, parentCommentId = null) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to comment.");
      return;
    }
    if (!text.trim()) return;

    try {
      // Include video ID in payload so backend can link the comment
      const payload = { content: text, video: video._id };
      if (parentCommentId) payload.parentCommentId = parentCommentId;

      // POST comment to backend
      const response = await api.addComment(video._id, payload);
      let newComment = response;
      if (!newComment) throw new Error("No comment returned from server");

      // Manually populate the owner field on the client-side for immediate display
      if (user) {
        newComment.owner = {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
        };
      }

      // Update UI: if it's a reply, add to parent; else prepend to comments
      if (parentCommentId) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentCommentId
              ? { ...c, replies: [newComment, ...(c.replies || [])] }
              : c
          )
        );
      } else {
        setComments((prev) => [newComment, ...prev]);
      }

      toast.success("Comment posted!");
    } catch (err) {
      console.error("Failed to post comment:", err);
      const message =
        err.response?.data?.message || err.message || "Failed to post comment.";
      toast.error(message);
    }
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
    setVideo((prev) => {
      if (!prev) return null;
      const newIsLiked = !prev.isLiked;
      const newLikesCount = newIsLiked
        ? prev.likesCount + 1
        : prev.likesCount - 1;
      return { ...prev, isLiked: newIsLiked, likesCount: newLikesCount };
    });

    try {
      await api.toggleVideoLike(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!video) return <div className="p-6 text-center">Video not found.</div>;

  return (
    <div className="flex flex-col lg:flex-row p-4 md:p-6 gap-6">
      <div className="w-full lg:flex-grow">
        <div className="aspect-video bg-black rounded-xl mb-4 overflow-hidden">
          <video
            className="w-full h-full"
            src={video.videoFile?.url || video.videoFile || null}
            title={video.title}
            controls
            onPlay={handleRecordView}
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
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
              className={`ml-4 px-4 py-2 rounded-full font-semibold ${
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
              <ThumbsDown size={20} />
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

        <Comments
          comments={comments}
          onPostComment={handlePostComment}
          userAvatar={user?.avatar}
          videoOwnerId={video.owner?._id}
        />
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
              timestamp={
                recVideo.createdAt
                  ? new Date(recVideo.createdAt).toLocaleDateString()
                  : ""
              }
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
