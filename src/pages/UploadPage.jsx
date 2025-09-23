import { useState, useEffect } from "react";
import { publishVideo } from "../lib/api";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploadState, setUploadState] = useState({
    status: "idle", // idle, uploading, success, error
    progress: 0,
    message: "",
  });

  useEffect(() => {
    // Cleanup function to revoke the object URL to avoid memory leaks
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
    // In a real app, you would send this formData to your backend API
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile); // Corrected field name
    formData.append("thumbnail", thumbnailFile);

    setUploadState({
      status: "uploading",
      progress: 0,
      message: "Starting upload...",
    });

    try {
      await publishVideo(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadState({
            status: "uploading",
            progress: percentCompleted,
            message: `Uploading... ${percentCompleted}%`,
          });
        },
      });
      setUploadState({
        status: "success",
        progress: 100,
        message: "Upload successful!",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadState({
        status: "error",
        progress: 0,
        message: "Upload failed. Please try again.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-[#0f0f0f]">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-[#121212] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Upload Video
        </h1>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          // Prevent submission if already uploading
          onKeyDown={(e) => {
            if (e.key === "Enter" && uploadState.status === "uploading") {
              e.preventDefault();
            }
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
              placeholder="My Awesome Video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploadState.status === "uploading"}
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
              placeholder="A detailed description of your video..."
              value={description}
              disabled={uploadState.status === "uploading"}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="video"
              className="block text-sm font-medium text-gray-300"
            >
              Video File
            </label>
            <input
              type="file"
              id="video"
              accept="video/*"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setVideoFile(e.target.files[0])}
              disabled={uploadState.status === "uploading"}
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
              disabled={uploadState.status === "uploading"}
              required
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
          {/* Progress Bar and Status */}
          {uploadState.status === "uploading" && (
            <div className="space-y-2">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-center text-gray-300">
                {uploadState.message}
              </p>
            </div>
          )}
          {uploadState.status === "success" && (
            <p className="text-sm text-center font-medium text-green-500">
              {uploadState.message}
            </p>
          )}
          {uploadState.status === "error" && (
            <p className="text-sm text-center font-medium text-red-500">
              {uploadState.message}
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={uploadState.status === "uploading"}
          >
            {uploadState.status === "uploading" ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
