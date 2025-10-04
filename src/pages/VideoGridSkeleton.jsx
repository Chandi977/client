import VideoCardSkeleton from "./VideoCardSkeleton";

const VideoGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default VideoGridSkeleton;
