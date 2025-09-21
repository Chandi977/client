import { useState } from "react";
import { X, Search } from "lucide-react";
import toast from "react-hot-toast";
import { searchVideos, addVideoToPlaylist } from "../lib/api";
import VideoCard from "./VideoCard";

const AddVideosToPlaylistModal = ({
  playlistId,
  existingVideoIds,
  onClose,
  onVideosAdded,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedVideoIds, setAddedVideoIds] = useState(existingVideoIds);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await searchVideos(query);
      setResults(response.data || []);
    } catch (error) {
      toast.error("Failed to search for videos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (videoId) => {
    try {
      await addVideoToPlaylist(videoId, playlistId);
      setAddedVideoIds((prev) => [...prev, videoId]);
      toast.success("Video added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add video.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#121212] rounded-lg w-full max-w-2xl p-4 flex flex-col h-[90vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="font-bold text-lg">Add videos to playlist</h2>
          <button
            onClick={() => {
              onVideosAdded();
              onClose();
            }}
          >
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSearch}
          className="w-full flex mb-4 flex-shrink-0"
        >
          <input
            type="text"
            placeholder="Search for videos to add"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-800 border border-gray-700 border-l-0 rounded-r-full px-6 hover:bg-gray-700"
          >
            <Search size={20} />
          </button>
        </form>

        <div className="flex-grow overflow-y-auto space-y-4 pr-2">
          {loading && <p className="text-center">Searching...</p>}
          {results.map((video) => {
            const isAdded = addedVideoIds.includes(video._id);
            return (
              <div key={video._id} className="flex items-center gap-4">
                <div className="flex-grow">
                  <VideoCard
                    videoId={video._id}
                    {...video}
                    variant="horizontal"
                  />
                </div>
                <button
                  onClick={() => handleAddVideo(video._id)}
                  disabled={isAdded}
                  className="px-4 py-2 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {isAdded ? "Added" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddVideosToPlaylistModal;
