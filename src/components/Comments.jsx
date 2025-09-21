import { useState } from "react";
import Comment from "./Comment";
import { User } from "lucide-react";

const Comments = ({
  comments = [],
  onPostComment,
  userAvatar,
  videoOwnerId,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    onPostComment(newComment, null);
    setNewComment("");
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>

      {/* Add Comment Input */}
      <div className="flex items-start gap-4 mb-8">
        {userAvatar ? (
          <img
            src={userAvatar}
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <User size={40} className="rounded-full bg-gray-700 p-2" />
        )}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-gray-700 focus:border-white outline-none pb-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {newComment && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setNewComment("")}
                className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600"
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              id={comment._id}
              commentOwnerId={comment.owner?._id}
              author={comment.owner?.username || "Unknown"}
              avatar={comment.owner?.avatar || null}
              text={comment.content}
              likes={comment.likesCount || 0}
              isLiked={comment.isLiked}
              timestamp={new Date(comment.createdAt).toLocaleDateString()}
              onPostComment={onPostComment}
              replies={comment.replies || []}
              videoOwnerId={videoOwnerId}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
