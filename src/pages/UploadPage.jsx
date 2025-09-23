import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import * as api from "../lib/api";
import { useUser } from "../components/UserContext";

const formatSpeed = (bytesPerSecond) => {
  if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(2)} B/s`;
  if (bytesPerSecond < 1024 * 1024)
    return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
};

const formatTime = (seconds) => {
  if (!isFinite(seconds) || seconds < 0) return "calculating...";
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
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, processing, success, error, canceled
  const [progress, setProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [processingStages, setProcessingStages] = useState({}); // { stageName: { percent, eta } }

  const { user } = useUser();
  const progressRef = useRef({ lastLoaded: 0, lastTimestamp: 0 });
  const cancelTokenRef = useRef(null);
  const videoIdRef = useRef(null);
  const navigate = useNavigate();

  const videoPlayerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  // WebSocket for processing stages
  useEffect(() => {
    if (uploadStatus !== "processing" || !user?._id || !videoIdRef.current)
      return;

    const wsUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:8000"
    ).replace(/^http/, "ws");
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          channel: `video-processing:${user._id}`,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.videoId !== videoIdRef.current) return;

        switch (data.type) {
          case "processing-progress":
            setProcessingStages((prev) => ({
              ...prev,
              [data.stage]: { percent: data.percent, eta: data.eta },
            }));
            break;
          case "video-ready":
            setUploadStatus("success");
            toast.success("Video ready!");
            // Automatically set video source
            if (videoPlayerRef.current) {
              videoPlayerRef.current.src = data.videoUrl;
              videoPlayerRef.current.load();
              videoPlayerRef.current.play();
            }
            break;
          case "processing-failed":
            setUploadStatus("error");
            toast.error(`Processing failed: ${data.message}`);
            break;
        }
      } catch (e) {
        console.error("WebSocket parse error:", e);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      toast.error("Processing server connection failed.");
      setUploadStatus("error");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "unsubscribe",
            channel: `video-processing:${user._id}`,
          })
        );
        ws.close();
      }
    };
  }, [uploadStatus, user?._id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadProgress = (e) => {
    const { loaded, total = 0 } = e;
    const percent = Math.floor((loaded * 100) / total);
    setProgress(percent);

    const now = performance.now();
    const bytesLoaded = loaded - progressRef.current.lastLoaded;
    const timeElapsed = (now - progressRef.current.lastTimestamp) / 1000;

    if (total > 0 && timeElapsed > 0.5) {
      const speed = bytesLoaded / timeElapsed;
      setUploadSpeed(speed);
      setEstimatedTime((total - loaded) / speed);
      progressRef.current = { lastLoaded: loaded, lastTimestamp: now };
    }
  };

  const startUpload = async () => {
    if (!videoFile || !thumbnailFile || !title) {
      toast.error("Please fill all required fields.");
      return;
    }

    setUploadStatus("uploading");
    setProgress(0);
    setUploadSpeed(0);
    setEstimatedTime(0);
    setProcessingStages({});
    progressRef.current = { lastLoaded: 0, lastTimestamp: performance.now() };
    cancelTokenRef.current = new AbortController();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      const response = await api.publishVideo(formData, {
        onUploadProgress: handleUploadProgress,
        signal: cancelTokenRef.current.signal,
      });

      const uploadedVideo = response.data.data;
      videoIdRef.current = uploadedVideo._id;
      setUploadStatus("processing");
      toast.success("Upload complete! Processing started...");
    } catch (error) {
      if (axios.isCancel(error)) {
        setUploadStatus("canceled");
        toast.error("Upload canceled");
      } else {
        setUploadStatus("error");
        toast.error(error.response?.data?.message || "Upload failed");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startUpload();
  };

  const handleCancelUpload = () => cancelTokenRef.current?.abort();
  const handleRetryUpload = () => {
    setUploadStatus("idle");
    setProgress(0);
    setProcessingStages({});
    startUpload();
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] bg-[#0f0f0f]">
      <div className="w-full max-w-2xl p-6 space-y-4 bg-[#121212] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 justify-center">
          <UploadCloud /> Upload Video
        </h1>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoPlayerRef} className="w-full h-full" controls />
          {(uploadStatus === "uploading" || uploadStatus === "processing") && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white space-y-2">
              {uploadStatus === "uploading" && (
                <>
                  <p>Uploading {progress}%</p>
                  <p>
                    {formatSpeed(uploadSpeed)} • {formatTime(estimatedTime)}{" "}
                    left
                  </p>
                </>
              )}
              {uploadStatus === "processing" &&
                Object.entries(processingStages).map(([stage, info]) => (
                  <div key={stage} className="w-11/12">
                    <p>
                      {stage}: {info.percent}%
                    </p>
                    <div className="w-full bg-gray-700 h-2.5 rounded-full">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${info.percent}%` }}
                      />
                    </div>
                    <p className="text-xs">
                      {info.eta ? `ETA: ${info.eta}` : "calculating..."}
                    </p>
                  </div>
                ))}
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
            disabled={
              uploadStatus === "uploading" || uploadStatus === "processing"
            }
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-[#0f0f0f] border border-gray-700 text-white"
            disabled={
              uploadStatus === "uploading" || uploadStatus === "processing"
            }
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
            disabled={
              uploadStatus === "uploading" || uploadStatus === "processing"
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
            disabled={
              uploadStatus === "uploading" || uploadStatus === "processing"
            }
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="thumbnail"
              className="mt-2 rounded max-h-32"
            />
          )}

          {uploadStatus === "idle" && (
            <button
              type="submit"
              className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-700"
            >
              Upload
            </button>
          )}
          {(uploadStatus === "error" || uploadStatus === "canceled") && (
            <button
              type="button"
              onClick={handleRetryUpload}
              className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-700"
            >
              Retry
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
