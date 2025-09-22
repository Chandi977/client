import { useState } from "react";
import toast from "react-hot-toast";
import { createPlaylist } from "../lib/api";

const CreatePlaylistForm = ({ onPlaylistCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Playlist name is required.");
      return;
    }
    setLoading(true);
    try {
      const newPlaylist = await createPlaylist({
        name,
        description,
        isPrivate,
      });
      toast.success("Playlist created!");
      onPlaylistCreated(newPlaylist.data.data);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Failed to create playlist:", err);
      toast.error(err.response?.data?.message || "Could not create playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-[#121212] rounded-lg space-y-4"
    >
      <h3 className="font-bold text-lg">Create new playlist</h3>
      <div>
        <input
          type="text"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
          rows="3"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-4 h-4 accent-blue-500"
          />
          <label htmlFor="isPrivate" className="text-sm text-gray-300">
            Private
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-500"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreatePlaylistForm;
