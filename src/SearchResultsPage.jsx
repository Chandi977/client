import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchVideos } from "./lib/api";
import VideoCard from "./components/VideoCard";
import { useUser } from "./components/UserContext";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search_query");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: userLoading } = useUser();

  useEffect(() => {
    if (!query || userLoading) {
      setVideos([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchVideos(query);
        setVideos(response.data || []);
      } catch (err) {
        setError("Failed to fetch search results.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, userLoading]);

  if (loading) return <div className="p-6 text-center">Searching...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-[calc(100vh-3.5rem)]">
      <h1 className="text-2xl font-bold mb-6">Search results for: "{query}"</h1>
      <div className="flex flex-col gap-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoCard
              key={video._id}
              videoId={video._id}
              {...video}
              variant="horizontal"
            />
          ))
        ) : (
          <p>No videos found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
