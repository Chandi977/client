import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useVideoUpload } from "../components/useVideoUpload";
import { useUser } from "../components/UserContext";

const formatSpeed = (bytesPerSecond) => {
  // This function is not used, can be removed
  if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(2)} B/s`;
  if (bytesPerSecond < 1024 * 1024)
    return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
};

const formatTime = (seconds) => {
  if (!isFinite(seconds) || seconds < 0) return "calculating..."; // This function is not used, can be removed
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();

  const videoPlayerRef = useRef(null);

  const { user } = useUser();

  const {
    isUploading,
    isProcessing,
    progress,
    stage,
    message,
    error,
    result,
    isCancelled,
    uploadVideo,
    cancelUpload,
    resetUpload,
  } = useVideoUpload(user?._id);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  useEffect(() => {
    if (result && videoPlayerRef.current) {
      videoPlayerRef.current.src = result.videoFile.url;
      videoPlayerRef.current.load();
      videoPlayerRef.current.play();
    }
  }, [result]);

  const handleThumbnailChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }, []);

  const startUpload = useCallback(async () => {
    if (!videoFile || !thumbnailFile || !title) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);

    await uploadVideo(formData);
  }, [videoFile, thumbnailFile, title, description, uploadVideo]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (result) {
        handleReset();
      } else startUpload();
    },
    [startUpload, result]
  );

  const isUploadingOrProcessing = isUploading || isProcessing;
  const uploadStatus = isUploading
    ? "uploading"
    : isProcessing
    ? "processing"
    : result
    ? "success"
    : error
    ? "error"
    : isCancelled
    ? "cancelled"
    : "idle";

  const handleReset = () => {
    resetUpload();
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (videoPlayerRef.current) videoPlayerRef.current.src = "";
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-[#0f0f0f]">
      <div className="w-full max-w-2xl p-6 space-y-4 bg-[#121212] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 justify-center">
          <UploadCloud /> Upload Video
        </h1>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoPlayerRef}
            className="w-full h-full"
            controls={!isUploadingOrProcessing}
          />
          {isUploadingOrProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white space-y-2">
              <p className="text-lg font-semibold capitalize">{stage}...</p>
              <div className="w-11/12 bg-gray-700 h-2.5 rounded-full">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p>{message}</p>
            </div>
          )}
          {result && (
            <div className="absolute inset-0 bg-green-900/80 flex flex-col justify-center items-center text-white space-y-3">
              <CheckCircle size={48} className="text-green-400" />
              <h3 className="text-xl font-bold">Upload Complete!</h3>
              <p className="text-sm text-green-200">
                Your video is now available.
              </p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 bg-red-900/80 flex flex-col justify-center items-center text-white space-y-3 text-center px-4">
              <XCircle size={48} className="text-red-400" />
              <h3 className="text-xl font-bold">Upload Failed</h3>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          {isCancelled && (
            <div className="absolute inset-0 bg-gray-800/80 flex flex-col justify-center items-center text-white space-y-3">
              <AlertTriangle size={48} className="text-yellow-400" />
              <h3 className="text-xl font-bold">Upload Cancelled</h3>
            </div>
          )}
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-[#0f0f0f] border border-gray-700 text-white"
            disabled={isUploadingOrProcessing || !!result}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-[#0f0f0f] border border-gray-700 text-white"
            disabled={isUploadingOrProcessing || !!result}
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            disabled={isUploadingOrProcessing || !!result}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
            disabled={isUploadingOrProcessing || !!result}
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="thumbnail"
              className={`mt-2 rounded max-h-32 ${result ? "opacity-50" : ""}`}
            />
          )}

          {uploadStatus === "idle" || !!result ? (
            <button
              type="submit"
              className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-700 disabled:bg-gray-600"
              disabled={isUploadingOrProcessing || (!result && !videoFile)}
            >
              {result ? "Upload Another" : "Upload"}
            </button>
          ) : null}

          {isUploadingOrProcessing && (
            <button
              type="button"
              onClick={cancelUpload}
              className="w-full bg-red-600 py-2 rounded text-white hover:bg-red-700"
            >
              Cancel Upload
            </button>
          )}

          {(uploadStatus === "error" || uploadStatus === "cancelled") && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-700"
            >
              Retry Upload
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
