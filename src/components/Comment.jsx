// Comment.jsx
import { useState, useEffect } from "react";
import { ThumbsUp, User } from "lucide-react";
import { format } from "date-fns";
import { format as formatTimeAgo } from "timeago.js";
import { toggleCommentLike } from "../lib/api";
import toast from "react-hot-toast";
import { secureUrl } from "../lib/utils";
import { useUser } from "./UserContext";

const Comment = ({
  id,
  avatar,
  commentOwnerId,
  author,
  timestamp,
  text,
  likes,
  replies = [],
  isLiked: initialIsLiked,
  onPostComment,
  videoOwnerId,
}) => {
  const { isLoggedIn } = useUser();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(likes);

  const formattedTimestamp = timestamp ? formatTimeAgo(timestamp) : "";
  const fullTimestamp = timestamp
    ? format(new Date(timestamp), "d MMMM yyyy 'at' h:mm a")
    : "";

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(likes);
  }, [initialIsLiked, likes]);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onPostComment(replyText, id);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to like a comment.");
      return;
    }

    const originalIsLiked = isLiked;
    const originalLikesCount = likesCount;

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (originalIsLiked ? prev - 1 : prev + 1));

    try {
      await toggleCommentLike(id);
    } catch (error) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalLikesCount);
      console.error("Failed to toggle comment like:", error);
    }
  };

  return (
    <div className="flex items-start gap-4 text-white">
      <img
        src={secureUrl(avatar)}
        alt={author}
        loading="lazy"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`font-semibold text-sm ${
              commentOwnerId === videoOwnerId
                ? "bg-gray-700 px-2 py-0.5 rounded-md"
                : ""
            }`}
          >
            {author}
          </p>
          <p
            className="text-xs text-gray-400 hover:text-white"
            title={fullTimestamp}
          >
            {formattedTimestamp}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-200">{text}</p>

        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1 text-gray-400 hover:text-blue-400 ${
              isLiked ? "text-blue-500" : ""
            }`}
          >
            <ThumbsUp size={16} />
            <span className="text-xs">{likesCount}</span>
          </button>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs font-semibold text-gray-400 hover:text-white"
          >
            REPLY
          </button>
        </div>

        {isReplying && (
          <div className="flex items-start gap-4 mt-4">
            <User size={24} className="rounded-full mt-1 bg-gray-700 p-1" />
            <div className="flex-grow min-w-0">
              <input
                type="text"
                placeholder={`Reply to ${author}...`}
                className="w-full bg-gray-900 text-white border-b border-gray-600 focus:border-white outline-none pb-1 text-sm"
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-800 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white"
                  disabled={!replyText.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {replies && replies.length > 0 && (
          <div className="mt-4 pl-6 border-l-2 border-gray-700 flex flex-col gap-4">
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                id={reply._id}
                commentOwnerId={reply.owner?._id}
                author={reply.owner?.username}
                avatar={reply.owner?.avatar}
                timestamp={reply.createdAt}
                text={reply.content}
                likes={reply.likesCount || 0}
                isLiked={reply.isLiked}
                onPostComment={onPostComment}
                videoOwnerId={videoOwnerId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
