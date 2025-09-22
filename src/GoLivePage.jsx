import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { createLiveStream } from "./lib/api";

const GoLivePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamDetails, setStreamDetails] = useState(null);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      const response = await createLiveStream(formData);
      setStreamDetails(response.data.data);
      toast.success("Live stream created successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create live stream."
      );
    } finally {
      setLoading(false);
    }
  };

  if (streamDetails) {
    const rtmpUrl = streamDetails.rtmpUrl;

    return (
      <div className="p-6 bg-[#0f0f0f] min-h-[calc(100vh-3.5rem)] text-white flex justify-center items-center">
        <div className="w-full max-w-2xl p-8 space-y-6 bg-[#121212] rounded-lg shadow-md">
          <Helmet>
            <title>Stream Ready - YoutubeClone</title>
          </Helmet>
          <h1 className="text-3xl font-bold text-center">
            Your Stream is Ready!
          </h1>
          <div className="space-y-4">
            <p className="text-center text-gray-400">
              Enter the following details into your streaming software (e.g.,
              OBS, Streamlabs).
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Server URL
              </label>
              <input
                type="text"
                readOnly
                value={rtmpUrl}
                className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md cursor-pointer"
                onClick={(e) => {
                  e.target.select();
                  navigator.clipboard.writeText(rtmpUrl);
                  toast.success("Server URL copied to clipboard!");
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Stream Key
              </label>
              <input
                type="password"
                readOnly
                value={streamDetails.streamKey}
                className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md cursor-pointer"
                onClick={(e) => {
                  e.target.type = "text";
                  e.target.select();
                  navigator.clipboard.writeText(streamDetails.streamKey);
                  toast.success("Stream Key copied to clipboard!");
                }}
                onBlur={(e) => (e.target.type = "password")}
              />
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
        <h1 className="text-2xl font-bold text-center text-white">
          Setup Your Live Stream
        </h1>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && loading) e.preventDefault();
          }}
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="My Awesome Stream"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="A detailed description of your stream..."
              value={description}
              disabled={loading}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-300"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              className="w-full px-3 py-2 mt-1 text-white bg-[#0f0f0f] border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="e.g., Gaming, Music, Education"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-300"
            >
              Thumbnail Image
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleThumbnailChange}
              disabled={loading}
            />
          </div>
          {thumbnailPreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-300">
                Thumbnail Preview:
              </p>
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="mt-2 rounded-lg max-h-40"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
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
