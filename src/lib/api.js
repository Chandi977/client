// src/api.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // send cookies automatically
});

// ----------------- RESPONSE INTERCEPTOR -----------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional global auth error handling
    if (error.response?.status === 401) {
      // e.g., redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ================= USER APIs =================
// Public
export const registerUser = (formData) => api.post("/users/register", formData);
export const loginUser = (credentials) => api.post("/users/login", credentials);
export const refreshToken = () => api.post("/users/refresh-token");

// Protected
export const logoutUser = () => api.post("/users/logout");
export const getCurrentUser = () => api.get("/users/me");
export const changePassword = (data) =>
  api.patch("/users/change-password", data);
export const updateAccountDetails = (data) =>
  api.patch("/users/update-account", data);
export const updateAvatar = (formData) =>
  api.patch("/users/update-avatar", formData);
export const updateCoverImage = (formData) =>
  api.patch("/users/update-cover", formData);
export const getUserChannelProfile = (username) =>
  api.get(`/users/channel/${username}`);
export const getWatchHistory = () => api.get("/users/watch-history");
export const getFeed = () => api.get("/users/feed");
export const recommendedVideos = () => api.get("/users/recommended-videos");
export const recommendChannels = () => api.get("/users/recommended-channels");
export const getLikedVideos = () => api.get("/users/liked-videos");
export const getHistory = () => api.get("/users/history");

// ================= VIDEO APIs =================
// Public
export const getAllVideos = (params = {}) =>
  api.get("/videos/getvideos", { params });
export const getVideoById = (videoId) => api.get(`/videos/${videoId}`);
export const recordView = (videoId) => api.post(`/videos/${videoId}/view`);
export const getUserVideos = (userId) => api.get(`/videos/user/${userId}`);
export const searchVideos = (query) => api.get(`/videos/search?query=${query}`);
export const streamVideo = (videoId) =>
  `${BACKEND_URL}/videos/stream/${videoId}`;
export const getPublishedVideos = () => api.get("/videos/published/all");
export const getUnpublishedVideos = () => api.get("/videos/unpublished/all");
export const getTrendingVideos = () => api.get("/videos/trending/top");

// Protected
export const publishVideo = (formData, config) =>
  api.post("/videos/upload", formData, config);
export const updateVideo = (videoId, data) =>
  api.patch(`/videos/${videoId}`, data);
export const deleteVideo = (videoId) => api.delete(`/videos/${videoId}`);
export const togglePublishStatus = (videoId) =>
  api.patch(`/videos/toggle/publish/${videoId}`);

// ================= PLAYLIST APIs =================
export const createPlaylist = (data) => api.post("/playlist", data);
export const getPlaylistById = (playlistId) =>
  api.get(`/playlist/${playlistId}`);
export const updatePlaylist = (playlistId, data) =>
  api.patch(`/playlist/${playlistId}`, data);
export const deletePlaylist = (playlistId) =>
  api.delete(`/playlist/${playlistId}`);
export const addVideoToPlaylist = (videoId, playlistId) =>
  api.patch(`/playlist/add/${videoId}/${playlistId}`);
export const removeVideoFromPlaylist = (videoId, playlistId) =>
  api.patch(`/playlist/remove/${videoId}/${playlistId}`);
export const getUserPlaylists = (userId) => api.get(`/playlist/user/${userId}`);

// ================= SUBSCRIPTION APIs =================
export const toggleSubscription = (channelId) =>
  api.post(`/subscriptions/c/${channelId}`);
export const getSubscribedChannels = (subscriberId) =>
  api.get(`/subscriptions/c/${subscriberId}`);
export const getUserSubscribers = (channelId) =>
  api.get(`/subscriptions/u/${channelId}`);

// ================= LIKE APIs =================
export const toggleVideoLike = (videoId) =>
  api.post(`/likes/v/${videoId}/toggle`);
export const getVideoLikes = (videoId) => api.get(`/likes/v/${videoId}`);
export const toggleCommentLike = (commentId) =>
  api.post(`/likes/c/${commentId}/toggle`);
export const getCommentLikes = (commentId) => api.get(`/likes/c/${commentId}`);
export const getTweetLikes = (tweetId) => api.get(`/likes/t/${tweetId}`);
export const getAllLikedVideos = () => api.get(`/likes/videos`);

// ================= TWEET APIs =================
export const createTweet = (data) => api.post("/tweets", data);
export const getUserTweets = (userId) => api.get(`/tweets/user/${userId}`);
export const deleteTweet = (tweetId) => api.delete(`/tweets/${tweetId}`);

// ================= COMMENT APIs =================
export const getVideoComments = (videoId, params) =>
  api.get(`/comments/${videoId}`, { params });
export const addComment = (videoId, data) =>
  api.post(`/comments/${videoId}`, data);
export const updateComment = (commentId, data) =>
  api.patch(`/comments/c/${commentId}`, data);
export const deleteComment = (commentId) =>
  api.delete(`/comments/c/${commentId}`);

// ================= LIVE STREAM APIs =================
export const getLiveStreams = () => api.get(`/livestreams`);
export const createLiveStream = (formData) =>
  api.post(`/livestreams`, formData);
export const getLiveStream = (streamId) => api.get(`/livestreams/${streamId}`);
export const updateStreamSettings = (streamId, data) =>
  api.patch(`/livestreams/${streamId}`, data);
export const deleteLiveStream = (streamId) =>
  api.delete(`/livestreams/${streamId}`);
export const startLiveStream = (streamId) =>
  api.post(`/livestreams/${streamId}/start`);
export const endLiveStream = (streamId) =>
  api.post(`/livestreams/${streamId}/end`);
export const joinLiveStream = (streamId) =>
  api.post(`/livestreams/${streamId}/join`);
export const leaveLiveStream = (streamId) =>
  api.post(`/livestreams/${streamId}/leave`);
export const getStreamAnalytics = (streamId) =>
  api.get(`/livestreams/${streamId}/analytics`);
export const getLiveComments = (streamId) =>
  api.get(`/livestreams/${streamId}/comments`);
export const addLiveComment = (streamId, data) =>
  api.post(`/livestreams/${streamId}/comments`, data);
export const getFeaturedComments = (streamId) =>
  api.get(`/livestreams/${streamId}/comments/featured`);
export const toggleLiveCommentLike = (commentId) =>
  api.post(`/livestreams/comments/${commentId}/like`);
export const replyToLiveComment = (commentId, data) =>
  api.post(`/livestreams/comments/${commentId}/reply`, data);
export const toggleCommentPin = (commentId) =>
  api.patch(`/livestreams/comments/${commentId}/pin`);
export const deleteLiveComment = (commentId) =>
  api.delete(`/livestreams/comments/${commentId}`);

// ================= DASHBOARD & HEALTHCHECK =================
export const getChannelStats = (userId) =>
  api.get(`/dashboard/stats/${userId}`);
export const getChannelVideos = (userId) =>
  api.get(`/dashboard/videos/${userId}`);
export const healthCheck = () => api.get("/healthcheck");

export default api;
