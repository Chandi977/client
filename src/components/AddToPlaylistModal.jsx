import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  createPlaylist,
} from "../lib/api";
import { useUser } from "./UserContext";
import { X } from "lucide-react";

const AddToPlaylistModal = ({ videoId, onClose }) => {
  const { user } = useUser();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (!user?._id) return;
    const fetchPlaylists = async () => {
      try {
        const response = await getUserPlaylists(user._id);
        // Mark which playlists already contain this video
        const playlistsWithVideoStatus = response.data.data.map((p) => ({
          ...p,
          hasVideo: p.videos.some((v) => v._id === videoId),
        }));
        setPlaylists(playlistsWithVideoStatus);
      } catch (error) {
        toast.error("Failed to load playlists.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [user, videoId]);

  const handleTogglePlaylist = async (playlistId, hasVideo) => {
    try {
      if (hasVideo) {
        await removeVideoFromPlaylist(videoId, playlistId);
        toast.success("Removed from playlist");
      } else {
        await addVideoToPlaylist(videoId, playlistId);
        toast.success("Added to playlist");
      }
      // Toggle the status locally for immediate feedback
      setPlaylists((prev) =>
        prev.map((p) =>
          p._id === playlistId ? { ...p, hasVideo: !p.hasVideo } : p
        )
      );
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      const response = await createPlaylist({ name: newPlaylistName });
      const newPlaylist = { ...response.data.data, hasVideo: false };
      setPlaylists((prev) => [newPlaylist, ...prev]);
      setNewPlaylistName("");
      toast.success("Playlist created!");
    } catch (error) {
      toast.error("Failed to create playlist.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-black/50 backdrop-blur-lg border border-gray-700 rounded-lg w-full max-w-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Save to...</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading && <p>Loading...</p>}
          {playlists.map((playlist) => (
            <div key={playlist._id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`playlist-${playlist._id}`}
                checked={playlist.hasVideo}
                onChange={() =>
                  handleTogglePlaylist(playlist._id, playlist.hasVideo)
                }
                className="w-5 h-5 accent-blue-500"
              />
              <label htmlFor={`playlist-${playlist._id}`}>
                {playlist.name}
              </label>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4">
          <form
            onSubmit={handleCreatePlaylist}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Create new playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="flex-grow bg-[#0f0f0f] border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-500"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
