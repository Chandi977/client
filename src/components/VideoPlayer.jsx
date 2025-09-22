import { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  Check,
} from "lucide-react";

const LAZY_LOAD_OFFSET = "200px";
const VideoPlayer = ({ src, poster, onNext, onPrevious, onPlay }) => {
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 for auto

  const [shouldLoad, setShouldLoad] = useState(false);

  const onIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setShouldLoad(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, {
      rootMargin: LAZY_LOAD_OFFSET,
    });
    const currentRef = playerContainerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onIntersection]);

  // HLS setup and player event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const setupHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setQualities(data.levels);
          setCurrentQuality(-1); // Auto
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          setCurrentQuality(data.level);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    };

    if (src) {
      if (src.endsWith(".m3u8")) setupHls();
      else video.src = src;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", onPlay);

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      if (onPlay) video.removeEventListener("play", onPlay);
    };
  }, [src, onPlay, shouldLoad]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlayPause();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullScreen();
          break;
        case "arrowright":
          videoRef.current.currentTime += 5;
          break;
        case "arrowleft":
          videoRef.current.currentTime -= 5;
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const handleSpeedChange = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const handleQualityChange = (levelIndex) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    }
    setCurrentQuality(levelIndex);
    setShowSettings(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={playerContainerRef}
      className="relative w-full aspect-video bg-black group"
      onMouseMove={() => {
        setShowControls(true);
        clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(
          () => setShowControls(false),
          3000
        );
      }}
      onMouseLeave={() => clearTimeout(controlsTimeoutRef.current)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        onClick={togglePlayPause}
        playsInline
        preload="metadata"
      />

      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          {/* Timeline */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => (videoRef.current.currentTime = e.target.value)}
            className="w-full h-1 accent-blue-500 cursor-pointer"
          />

          {/* Bottom Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button onClick={onPrevious} className="text-white">
                <SkipBack />
              </button>
              <button onClick={togglePlayPause} className="text-white">
                {isPlaying ? <Pause /> : <Play />}
              </button>
              <button onClick={onNext} className="text-white">
                <SkipForward />
              </button>
              <div className="flex items-center gap-2">
                <button onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX /> : <Volume2 />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 accent-white"
                />
              </div>
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Settings"
                >
                  <Settings />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-sm rounded-md p-2 min-w-[150px]">
                    {/* Playback Speed */}
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold mb-1">Speed</h4>
                      {[0.5, 1, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handleSpeedChange(rate)}
                          className={`w-full text-left text-sm p-1 rounded hover:bg-gray-700 flex justify-between ${
                            playbackRate === rate ? "text-blue-400" : ""
                          }`}
                        >
                          {rate === 1 ? "Normal" : `${rate}x`}
                          {playbackRate === rate && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                    {/* Quality Selection */}
                    {qualities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Quality</h4>
                        <button
                          onClick={() => handleQualityChange(-1)}
                          className={`w-full text-left text-sm p-1 rounded hover:bg-gray-700 flex justify-between ${
                            currentQuality === -1 ? "text-blue-400" : ""
                          }`}
                        >
                          Auto
                          {currentQuality === -1 && <Check size={16} />}
                        </button>
                        {qualities.map((level, index) => (
                          <button
                            key={index}
                            onClick={() => handleQualityChange(index)}
                            className={`w-full text-left text-sm p-1 rounded hover:bg-gray-700 flex justify-between ${
                              currentQuality === index ? "text-blue-400" : ""
                            }`}
                          >
                            {level.height}p
                            {currentQuality === index && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button onClick={toggleFullScreen}>
                {isFullScreen ? <Minimize /> : <Maximize />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
