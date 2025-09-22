// Comments.jsx
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Comment from "./Comment";
import { User } from "lucide-react";
import { getVideoComments, addComment } from "../lib/api";
import { useUser } from "./UserContext";

const Comments = ({ videoId, videoOwnerId }) => {
  const { user, isLoggedIn } = useUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(
    async (currentPage) => {
      try {
        setLoading(true);
        const response = await getVideoComments(videoId, {
          page: currentPage,
          limit: 10,
        });
        const data = response.data.data || [];

        const populatedComments = data.map((c) => ({
          ...c,
          owner:
            c.owner && typeof c.owner === "object"
              ? c.owner
              : { username: "Unknown", avatar: "" },
        }));

        setComments((prev) =>
          currentPage === 1
            ? populatedComments
            : [...prev, ...populatedComments]
        );
        setHasNextPage(false); // adjust if your API has pagination
      } catch (error) {
        toast.error("Could not load comments.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [videoId]
  );

  useEffect(() => {
    if (videoId) {
      setComments([]);
      setPage(1);
      fetchComments(1);
    }
  }, [videoId, fetchComments]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  const onPostComment = async (text, parentCommentId = null) => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to comment.");
      return;
    }
    if (!text.trim()) return;

    try {
      const payload = { content: text };
      if (parentCommentId) payload.parentCommentId = parentCommentId;

      const response = await addComment(videoId, payload);
      const newCommentData = { ...response.data.data, owner: user };

      if (parentCommentId) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentCommentId
              ? { ...c, replies: [newCommentData, ...(c.replies || [])] }
              : c
          )
        );
      } else {
        setComments((prev) => [newCommentData, ...prev]);
      }

      toast.success("Comment posted!");
    } catch (err) {
      toast.error("Failed to post comment.");
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    onPostComment(newComment, null);
    setNewComment("");
  };

  return (
    <div className="mt-6 text-white">
      <h2 className="text-xl font-bold mb-4">{comments.length} Comments</h2>

      {/* Add Comment Input */}
      <div className="flex items-start gap-4 mb-8">
        {user?.avatar ? (
          <img
            src={user.avatar}
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
            className="w-full bg-gray-900 text-white border-b border-gray-600 focus:border-white outline-none pb-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {newComment && (
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setNewComment("")}
                className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white"
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
        {loading && <p className="text-center">Loading comments...</p>}
        {!loading && comments.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            id={comment._id}
            commentOwnerId={comment.owner?._id}
            author={comment.owner?.username || "Unknown"}
            avatar={comment.owner?.avatar || null}
            timestamp={comment.createdAt}
            text={comment.content}
            likes={comment.likesCount || 0}
            isLiked={comment.isLiked}
            onPostComment={onPostComment}
            replies={comment.replies || []}
            videoOwnerId={videoOwnerId}
          />
        ))}
        {hasNextPage && !loading && (
          <button
            onClick={handleLoadMore}
            className="w-full mt-4 px-4 py-2 bg-gray-700 rounded-full font-semibold hover:bg-gray-600"
          >
            Load More Comments
          </button>
        )}
      </div>
    </div>
  );
};

export default Comments;
