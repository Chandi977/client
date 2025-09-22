import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { createTweet, getUserTweets, deleteTweet } from "../lib/api";
import { useUser } from "./UserContext";
import { ThumbsUp, Trash2 } from "lucide-react";

const CommunityTab = ({ channel }) => {
  const { user, isLoggedIn } = useUser();
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channel?._id) {
      setLoading(false);
      return;
    }
    const fetchTweets = async () => {
      try {
        const response = await getUserTweets(channel._id);
        setTweets(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch tweets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, [channel]);

  const handlePostTweet = async () => {
    if (!newTweet.trim()) return;
    try {
      const response = await createTweet({ content: newTweet });
      // Manually construct the new tweet object with owner info for immediate UI update
      const newTweetData = {
        ...response.data.data,
        owner: { ...channel },
        likesCount: 0,
      };
      setTweets((prev) => [newTweetData, ...prev]);
      setNewTweet("");
      toast.success("Post created!");
    } catch (error) {
      toast.error("Failed to create post.");
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await deleteTweet(tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
      toast.success("Post deleted.");
    } catch (error) {
      toast.error("Failed to delete post.");
    }
  };

  const isOwner = isLoggedIn && user?._id === channel?._id;

  return (
    <div className="space-y-6 text-white">
      {!isLoggedIn && (
        <div className="bg-[#121212] p-4 rounded-lg text-center">
          <p className="mb-4">
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>{" "}
            to create a post and interact with the community.
          </p>
        </div>
      )}

      {isOwner && (
        <div className="bg-[#121212] p-4 rounded-lg">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="Create a new post..."
            className="w-full bg-[#0f0f0f] p-2 rounded-md border border-gray-700"
            rows="3"
          />
          <div className="text-right mt-2">
            <button
              onClick={handlePostTweet}
              className="px-4 py-2 bg-blue-600 rounded-full font-semibold"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-center">Loading posts...</p>}

      {!loading && tweets.length === 0 && (
        <p className="text-center text-gray-400">No posts yet.</p>
      )}

      {tweets.map((tweet) => (
        <div
          key={tweet._id}
          className="bg-[#121212] p-4 rounded-lg flex gap-4"
          data-aos="fade-up"
        >
          <img
            src={channel.avatar}
            alt={channel.username}
            className="w-12 h-12 rounded-full flex-shrink-0"
          />
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{channel.fullName}</p>
              <p className="text-sm text-gray-400">
                @{channel.username} &bull;{" "}
                {new Date(tweet.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-2">{tweet.content}</p>
            {isOwner && (
              <div className="text-right">
                <button
                  onClick={() => handleDeleteTweet(tweet._id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full"
                  aria-label="Delete post"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityTab;
