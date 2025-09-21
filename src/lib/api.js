// src/api.js
import axios from "axios";

// ----------------- BASE CONFIG -----------------
const BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies automatically
});

// ----------------- REQUEST INTERCEPTOR -----------------
// Automatically remove Content-Type for FormData requests
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; // Let browser set correct boundary
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// ----------------- HELPER FUNCTION -----------------
const handleResponse = async (promise) => {
  const res = await promise;
  return res.data;
};

// ================= USER APIs =================

// Public
export const registerUser = (formData) =>
  handleResponse(api.post("/users/register", formData));
export const loginUser = (credentials) =>
  handleResponse(api.post("/users/login", credentials));
export const refreshToken = () =>
  handleResponse(api.post("/users/refresh-token"));

// Protected
export const logoutUser = () => handleResponse(api.post("/users/logout"));
export const getCurrentUser = () => handleResponse(api.get("/users/me"));
export const changePassword = (data) =>
  handleResponse(api.patch("/users/change-password", data));
export const updateAccountDetails = (data) =>
  handleResponse(api.patch("/users/update-account", data));
export const updateAvatar = (formData) =>
  handleResponse(api.patch("/users/update-avatar", formData));
export const updateCoverImage = (formData) =>
  handleResponse(api.patch("/users/update-cover", formData));
export const getUserChannelProfile = (username) =>
  handleResponse(api.get(`/users/channel/${username}`));
export const getWatchHistory = () =>
  handleResponse(api.get("/users/watch-history"));
export const getFeed = () => handleResponse(api.get("/users/feed"));
export const recommendedVideos = () =>
  handleResponse(api.get("/users/recommended-videos"));
export const recommendChannels = () =>
  handleResponse(api.get("/users/recommended-channels"));
export const getLikedVideos = () =>
  handleResponse(api.get("/users/liked-videos"));
export const getHistory = () => handleResponse(api.get("/users/history"));

// ================= VIDEO APIs =================

// Public
export const getAllVideos = (params = {}) =>
  handleResponse(api.get("/videos/getvideos", { params }));
export const getVideoById = (videoId) =>
  handleResponse(api.get(`/videos/${videoId}`));
export const recordView = (videoId) =>
  handleResponse(api.post(`/videos/${videoId}/view`));
export const getUserVideos = (userId) =>
  handleResponse(api.get(`/videos/user/${userId}`));
export const searchVideos = (query) =>
  handleResponse(api.get(`/videos/search?query=${query}`));
export const streamVideo = (videoId) => `${BASE_URL}/videos/stream/${videoId}`;
export const getPublishedVideos = () =>
  handleResponse(api.get("/videos/published/all"));
export const getUnpublishedVideos = () =>
  handleResponse(api.get("/videos/unpublished/all"));
export const getTrendingVideos = () =>
  handleResponse(api.get("/videos/trending/top"));

// Protected
export const publishVideo = (formData, options) =>
  handleResponse(api.post("/videos/upload", formData, options));
export const updateVideo = (videoId, data) =>
  handleResponse(api.patch(`/videos/${videoId}`, data));
export const deleteVideo = (videoId) =>
  handleResponse(api.delete(`/videos/${videoId}`));
export const togglePublishStatus = (videoId) =>
  handleResponse(api.patch(`/videos/toggle/publish/${videoId}`));

// ================= PLAYLIST APIs =================
export const createPlaylist = (data) =>
  handleResponse(api.post("/playlist", data));
export const getPlaylistById = (playlistId) =>
  handleResponse(api.get(`/playlist/${playlistId}`));
export const updatePlaylist = (playlistId, data) =>
  handleResponse(api.patch(`/playlist/${playlistId}`, data));
export const deletePlaylist = (playlistId) =>
  handleResponse(api.delete(`/playlist/${playlistId}`));
export const addVideoToPlaylist = (videoId, playlistId) =>
  handleResponse(api.patch(`/playlist/add/${videoId}/${playlistId}`));
export const removeVideoFromPlaylist = (videoId, playlistId) =>
  handleResponse(api.patch(`/playlist/remove/${videoId}/${playlistId}`));
export const getUserPlaylists = (userId) =>
  handleResponse(api.get(`/playlist/user/${userId}`));

// ================= SUBSCRIPTION APIs =================
export const toggleSubscription = (channelId) =>
  handleResponse(api.post(`/subscriptions/c/${channelId}`));
export const getSubscribedChannels = (subscriberId) =>
  handleResponse(api.get(`/subscriptions/c/${subscriberId}`));
export const getUserSubscribers = (channelId) =>
  handleResponse(api.get(`/subscriptions/u/${channelId}`));

// ================= TWEET APIs =================
export const createTweet = (data) => handleResponse(api.post("/tweets", data));
export const createTweetWithImage = (formData) =>
  handleResponse(api.post("/tweets", formData));
export const getUserTweets = (userId) =>
  handleResponse(api.get(`/tweets/user/${userId}`));
export const updateTweet = (tweetId, formData) =>
  handleResponse(api.patch(`/tweets/${tweetId}`, formData));
export const deleteTweet = (tweetId) =>
  handleResponse(api.delete(`/tweets/${tweetId}`));
export const toggleTweetLike = (tweetId) =>
  handleResponse(api.post(`/tweets/${tweetId}/like`));
export const toggleTweetShare = (tweetId) =>
  handleResponse(api.post(`/tweets/${tweetId}/share`));
export const getTweetReplies = (tweetId) =>
  handleResponse(api.get(`/tweets/${tweetId}/replies`));

// ================= LIKE APIs =================
export const toggleVideoLike = (videoId) =>
  handleResponse(api.post(`/likes/toggle/v/${videoId}`));
export const toggleCommentLike = (commentId) =>
  handleResponse(api.post(`/likes/toggle/c/${commentId}`));
export const getAllLikedVideos = () => handleResponse(api.get(`/likes/videos`));

// ================= COMMENT APIs =================
export const getVideoComments = (videoId) =>
  handleResponse(api.get(`/comments/${videoId}`));
export const addComment = (videoId, data) =>
  handleResponse(api.post(`/comments/${videoId}`, data));
export const updateComment = (commentId, data) =>
  handleResponse(api.patch(`/comments/c/${commentId}`, data));
export const deleteComment = (commentId) =>
  handleResponse(api.delete(`/comments/c/${commentId}`));

// ================= LIVE STREAM APIs =================
export const getLiveStreams = () => handleResponse(api.get(`/livestreams`));
export const createLiveStream = (formData) =>
  handleResponse(api.post(`/livestreams`, formData));
export const getLiveStream = (streamId) =>
  handleResponse(api.get(`/livestreams/${streamId}`));
export const updateStreamSettings = (streamId, data) =>
  handleResponse(api.patch(`/livestreams/${streamId}`, data));
export const deleteLiveStream = (streamId) =>
  handleResponse(api.delete(`/livestreams/${streamId}`));
export const startLiveStream = (streamId) =>
  handleResponse(api.post(`/livestreams/${streamId}/start`));
export const endLiveStream = (streamId) =>
  handleResponse(api.post(`/livestreams/${streamId}/end`));
export const joinLiveStream = (streamId) =>
  handleResponse(api.post(`/livestreams/${streamId}/join`));
export const leaveLiveStream = (streamId) =>
  handleResponse(api.post(`/livestreams/${streamId}/leave`));
export const getStreamAnalytics = (streamId) =>
  handleResponse(api.get(`/livestreams/${streamId}/analytics`));

// Live Comments
export const getLiveComments = (streamId) =>
  handleResponse(api.get(`/livestreams/${streamId}/comments`));
export const addLiveComment = (streamId, data) =>
  handleResponse(api.post(`/livestreams/${streamId}/comments`, data));
export const getFeaturedComments = (streamId) =>
  handleResponse(api.get(`/livestreams/${streamId}/comments/featured`));
export const toggleLiveCommentLike = (commentId) =>
  handleResponse(api.post(`/livestreams/comments/${commentId}/like`));
export const replyToLiveComment = (commentId, data) =>
  handleResponse(api.post(`/livestreams/comments/${commentId}/reply`, data));
export const toggleCommentPin = (commentId) =>
  handleResponse(api.patch(`/livestreams/comments/${commentId}/pin`));
export const deleteLiveComment = (commentId) =>
  handleResponse(api.delete(`/livestreams/comments/${commentId}`));

// ================= DASHBOARD & HEALTHCHECK =================
export const getChannelStats = (userId) =>
  handleResponse(api.get(`/dashboard/stats/${userId}`));
export const getChannelVideos = (userId) =>
  handleResponse(api.get(`/dashboard/videos/${userId}`));
export const healthCheck = () => handleResponse(api.get("/healthcheck"));

export default api;
