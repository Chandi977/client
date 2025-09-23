import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubscribedChannels } from "../lib/api";
import { useUser } from "../components/UserContext";

const SubscriptionsPage = () => {
  const { user } = useUser();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      setError("You must be logged in to see your subscriptions.");
      setLoading(false);
      return;
    }

    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await getSubscribedChannels(user._id);
        // The API returns subscription documents, we need the 'channel' part
        setChannels(response.data.data.map((sub) => sub.channel) || []);
      } catch (err) {
        setError("Failed to fetch subscriptions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  if (loading)
    return <div className="p-6 text-center">Loading Subscriptions...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-[calc(100vh-3.5rem)]">
      <h1 className="text-2xl font-bold mb-6">Your Subscriptions</h1>
      <div className="flex flex-col gap-4">
        {channels.length > 0 ? (
          channels.map((channel) => (
            <Link
              to={`/channel/${channel.username}`}
              key={channel._id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800"
            >
              <img
                src={channel.avatar}
                alt={channel.username}
                className="w-12 h-12 rounded-full"
              />
              <p className="font-semibold">{channel.username}</p>
            </Link>
          ))
        ) : (
          <p>You are not subscribed to any channels yet.</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
