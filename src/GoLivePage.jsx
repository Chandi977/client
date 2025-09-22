import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { createLiveStream } from "./lib/api";

const categories = ["Gaming", "Music", "Education", "Sports", "Entertainment"];

const GoLivePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamDetails, setStreamDetails] = useState(null);
  const [showStreamKey, setShowStreamKey] = useState(false);

  const rtmpRef = useRef(null);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    try {
      const response = await createLiveStream(formData);
      setStreamDetails(response.data.data);
      toast.success("Live stream created successfully!");

      // Auto-scroll to RTMP info
      setTimeout(() => rtmpRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create live stream.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (streamDetails) {
    const { rtmpUrl, streamKey } = streamDetails;

    return (
      <div
        className="p-6 bg-[#0f0f0f] min-h-[calc(100vh-3.5rem)] text-white flex justify-center items-start"
      >
        <div className="w-full max-w-2xl p-8 space-y-6 bg-[#121212] rounded-lg shadow-md">
          <Helmet>
            <title>Stream Ready - YoutubeClone</title>
          </Helmet>
          <h1 className="text-3xl font-bold text-center">Your Stream is Ready!</h1>
          <div className="space-y-4" ref={rtmpRef}>
            <p className="text-center text-gray-400">
              Enter the following details into your streaming software (OBS, Streamlabs, etc.)
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-300">Server URL</label>
              <input
                type="text"
                readOnly
                value={rtmpUrl}
                className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md cursor-pointer"
                onClick={async (e) => {
                  e.target.select();
                  await navigator.clipboard.writeText(rtmpUrl);
                  toast.success("Server URL copied!");
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Stream Key</label>
              <div className="flex gap-2">
                <input
                  type={showStreamKey ? "text" : "password"}
                  readOnly
                  value={streamKey}
                  className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md cursor-pointer"
                  onClick={async (e) => {
                    e.target.select();
                    await navigator.clipboard.writeText(streamKey);
                    toast.success("Stream Key copied!");
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-2 mt-1 bg-gray-700 rounded-md hover:bg-gray-600"
                  onClick={() => setShowStreamKey(!showStreamKey)}
                >
                  {showStreamKey ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Warning: Do not share your stream key with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-[#0f0f0f]">
      <Helmet>
        <title>Go Live - YoutubeClone</title>
      </Helmet>
      <div className="w-full max-w-2xl p-8 space-y-6 bg-[#121212] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">Setup Your Live Stream</h1>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          onKeyDown={(e) => { if (e.key === "Enter" && loading) e.preventDefault(); }}
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="My Awesome Stream"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              rows="4"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="A detailed description of your stream..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Category</label>
            <select
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Tags (comma separated)</label>
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="gaming,fun,music"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleThumbnailChange}
              disabled={loading}
            />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="mt-2 rounded-lg max-h-40"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating..." : "Go Live"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoLivePage;
