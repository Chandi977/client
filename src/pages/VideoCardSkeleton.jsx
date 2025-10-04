const VideoCardSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-2 aspect-video w-full rounded-lg bg-gray-700"></div>
      <div className="flex items-start space-x-2">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gray-700"></div>
        <div className="w-full space-y-2">
          <div className="h-4 rounded-md bg-gray-700"></div>
          <div className="h-4 w-3/4 rounded-md bg-gray-700"></div>
          <div className="h-4 w-1/2 rounded-md bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
