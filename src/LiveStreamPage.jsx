import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLiveStreams } from "./lib/api";
import { Helmet } from "react-helmet-async";
import { secureUrl } from "./lib/utils";

const LiveStreamPage = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const response = await getLiveStreams();
        setStreams(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch live streams.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading live streams...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-[calc(100vh-3.5rem)] text-white">
      <Helmet>
        <title>Live Streams - YoutubeClone</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-6" data-aos="fade-in">
        Live Now
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.length > 0 ? (
          streams.map((stream) => (
            <Link
              to={`/live/${stream._id}`} // Assuming a future live stream detail page
              key={stream._id}
              className="bg-[#121212] p-4 rounded-lg hover:bg-gray-800"
              data-aos="fade-up"
            >
              <div className="aspect-video bg-gray-800 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={secureUrl(stream.thumbnail?.url)}
                  alt={stream.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-white line-clamp-2">
                {stream.title}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {stream.owner?.username}
              </p>
              <p className="text-sm text-red-500 font-bold mt-1">LIVE</p>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No one is live right now.
          </p>
        )}
      </div>
    </div>
  );
};

export default LiveStreamPage;
