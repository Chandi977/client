import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserPlaylists, getVideoById } from "./lib/api";
import { useUser } from "./components/UserContext";
import CreatePlaylistForm from "./components/CreatePlaylistForm";
import { ListVideo, ThumbsUp, History, Users } from "lucide-react";

const LibraryPage = () => {
  const { user, isLoggedIn, loading: userLoading } = useUser();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    if (!isLoggedIn || !user?._id) {
      setError("You must be logged in to view your library.");
      setLoading(false);
      return;
    }

    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await getUserPlaylists(user._id);
        const playlistsData = response.data.data || [];

        // Asynchronously fetch the thumbnail for the first video of each playlist
        const playlistsWithThumbnails = await Promise.all(
          playlistsData.map(async (playlist) => {
            let thumbnailUrl = null;
            // Check if there are videos and the first video has an ID
            if (
              playlist.videos &&
              playlist.videos.length > 0 &&
              playlist.videos[0]?._id
            ) {
              const firstVideoId = playlist.videos[0]._id;
              try {
                const videoDetailsRes = await getVideoById(firstVideoId);
                // The video object from getVideoById has the full thumbnail object
                thumbnailUrl = videoDetailsRes.data?.data?.thumbnail?.url;
              } catch (thumbError) {
                console.error(
                  `Failed to fetch thumbnail for video ${firstVideoId} in playlist ${playlist.name}`,
                  thumbError
                );
              }
            }
            return { ...playlist, thumbnailUrl };
          })
        );
        setPlaylists(playlistsWithThumbnails);
      } catch (err) {
        setError("Failed to fetch your playlists.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user, isLoggedIn, userLoading]);

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
  };

  if (loading) return <div className="p-6 text-center">Loading Library...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  //   console.log(playlists.videos[0].thumbnail?.url);
  //   console.log(playlists);

  return (
    <div className="p-6 bg-[#0f0f0f] min-h-[calc(100vh-3.5rem)]">
      <h1 className="text-3xl font-bold mb-6">Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">
              Playlists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <Link
                    to={`/playlist/${playlist._id}`}
                    key={playlist._id}
                    className="bg-[#121212] p-4 rounded-lg hover:bg-gray-800"
                  >
                    <div className="aspect-video bg-gray-700 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                      {playlist.thumbnailUrl ? (
                        <img
                          src={playlist.thumbnailUrl}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ListVideo size={48} className="text-gray-500" />
                      )}
                    </div>
                    <h3 className="font-semibold">{playlist.name}</h3>
                    <p className="text-sm text-gray-400">
                      {playlist.videos.length} videos
                    </p>
                  </Link>
                ))
              ) : (
                <p className="col-span-full">You have no playlists.</p>
              )}
            </div>
          </section>
        </div>
        <div className="space-y-6">
          <div className="bg-[#121212] p-4 rounded-lg space-y-2">
            <Link
              to="/history"
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800"
            >
              <History size={24} />
              <span className="font-semibold">Watch History</span>
            </Link>
            <Link
              to="/liked-videos"
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800"
            >
              <ThumbsUp size={24} />
              <span className="font-semibold">Liked Videos</span>
            </Link>
            <Link
              to="/subscriptions"
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800"
            >
              <Users size={24} />
              <span className="font-semibold">Subscriptions</span>
            </Link>
          </div>
          <CreatePlaylistForm onPlaylistCreated={handlePlaylistCreated} />
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
