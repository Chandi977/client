import { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UploadCloud,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useVideoUpload } from "../components/useVideoUpload";
import { useUser } from "../components/UserContext";

const predefinedGenres = [
  "Film & Animation",
  "Autos & Vehicles",
  "Music",
  "Pets & Animals",
  "Sports",
  "Travel & Events",
  "Gaming",
  "People & Blogs",
  "Comedy",
  "Entertainment",
  "News & Politics",
  "How-to & Style",
  "Education",
  "Science & Technology",
  "Nonprofits & Activism",
];

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [genre, setGenre] = useState("");
  const [customGenre, setCustomGenre] = useState("");

  const videoPlayerRef = useRef(null);
  // const navigate = useNavigate();
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

  // 🔹 Drag & Drop for Video
  const onDropVideo = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setVideoFile(acceptedFiles[0]);
    }
  }, []);
  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive,
  } = useDropzone({
    onDrop: onDropVideo,
    accept: { "video/*": [] },
    multiple: false,
  });

  // 🔹 Drag & Drop for Thumbnail
  const onDropThumbnail = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }, []);
  const {
    getRootProps: getThumbRootProps,
    getInputProps: getThumbInputProps,
    isDragActive: isThumbDragActive,
  } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { "image/*": [] },
    multiple: false,
  });

  const startUpload = useCallback(async () => {
    if (!videoFile || !thumbnailFile || !title || (!genre && !customGenre)) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("genre", customGenre || genre);

    await uploadVideo(formData);
  }, [
    videoFile,
    thumbnailFile,
    title,
    description,
    genre,
    customGenre,
    uploadVideo,
  ]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const reset = () => {
        resetUpload();
        setTitle("");
        setDescription("");
        setVideoFile(null);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setGenre("");
        setCustomGenre("");
        if (videoPlayerRef.current) videoPlayerRef.current.src = "";
      };

      if (result) {
        reset();
      } else startUpload();
    },
    [startUpload, result, resetUpload]
  );

  const handleReset = () => {
    resetUpload();
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setGenre("");
    setCustomGenre("");
    if (videoPlayerRef.current) videoPlayerRef.current.src = "";
  };

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

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-3.5rem)] bg-[#0f0f0f] p-4 sm:p-6">
      <div className="w-full max-w-6xl p-4 sm:p-6 space-y-6 bg-[#121212] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 justify-center">
          <UploadCloud /> Upload Video
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
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
            {/* Video Dropzone */}
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Upload Video File <span className="text-red-500">*</span>
              </label>
              <div
                {...getVideoRootProps()}
                className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${
                  isVideoDragActive
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-gray-700"
                }`}
              >
                <input
                  {...getVideoInputProps()}
                  disabled={isUploadingOrProcessing || !!result}
                />
                {videoFile ? (
                  <p className="text-green-400 flex items-center justify-center gap-2">
                    <Film /> {videoFile.name}
                  </p>
                ) : (
                  <p className="text-gray-400">
                    Drag & drop a video file here, or click to select
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded bg-[#0f0f0f] border border-gray-700 text-white"
                  disabled={isUploadingOrProcessing || !!result}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Description
                </label>
                <textarea
                  placeholder="Write a short description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded bg-[#0f0f0f] border border-gray-700 text-white"
                  disabled={isUploadingOrProcessing || !!result}
                />
              </div>

              {/* Genre Selection */}
              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Select Genre <span className="text-red-500">*</span>
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-2 rounded bg-[#0f0f0f] border border-gray-700 text-white"
                  disabled={isUploadingOrProcessing || !!result}
                >
                  <option value="">-- Select a genre --</option>
                  {predefinedGenres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                  <option value="custom">Custom Genre</option>
                </select>
                {genre === "custom" && (
                  <input
                    type="text"
                    placeholder="Enter custom genre"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    className="w-full mt-2 p-2 rounded bg-[#0f0f0f] border border-gray-700 text-white"
                    disabled={isUploadingOrProcessing || !!result}
                    required
                  />
                )}
              </div>

              {/* Thumbnail Dropzone */}
              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Upload Thumbnail Image <span className="text-red-500">*</span>
                </label>
                <div
                  {...getThumbRootProps()}
                  className={`border-2 border-dashed rounded p-6 text-center cursor-pointer ${
                    isThumbDragActive
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-gray-700"
                  }`}
                >
                  <input
                    {...getThumbInputProps()}
                    disabled={isUploadingOrProcessing || !!result}
                  />
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="thumbnail"
                      className={`mx-auto rounded max-h-32 ${
                        result ? "opacity-50" : ""
                      }`}
                    />
                  ) : (
                    <p className="text-gray-400 flex items-center justify-center gap-2">
                      <ImageIcon /> Drag & drop an image here, or click to
                      select
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-4">
                {uploadStatus === "idle" || !!result ? (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-700 disabled:bg-gray-600"
                    disabled={
                      isUploadingOrProcessing || (!result && !videoFile)
                    }
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
