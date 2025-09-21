import { useState } from "react";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";
import { toggleCommentLike } from "../lib/api";

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
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(likes);

  const handleReplySubmit = () => {
    // Pass the parent comment's ID when submitting a reply
    if (replyText.trim()) {
      onPostComment(replyText, id);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleToggleLike = async () => {
    // Optimistic UI update
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      await toggleCommentLike(id);
    } catch (error) {
      // Revert state on error
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle comment like:", error);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <img src={avatar} alt={author} className="w-10 h-10 rounded-full" />
      <div className="flex-grow">
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
          <p className="text-xs text-gray-400">{timestamp}</p>
        </div>
        <p className="mt-1 text-sm">{text}</p>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1 text-gray-400 hover:text-white ${
              isLiked ? "text-blue-500" : ""
            }`}
          >
            <ThumbsUp size={16} />
            <span className="text-xs">{likesCount}</span>
          </button>
          <button className="text-gray-400 hover:text-white">
            <ThumbsDown size={16} />
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
            <User size={24} className="rounded-full mt-1" />
            <div className="flex-grow ">
              <input
                type="text"
                placeholder={`Reply to ${author}...`}
                className="w-full bg-transparent border-b border-gray-700 focus:border-white outline-none pb-1 text-sm"
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsReplying(false)}
                  className="px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600"
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
                text={reply.content}
                likes={reply.likesCount || 0}
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
