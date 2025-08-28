//get this from env directly

const API_BASE_URL = "https://rj-server.icyflower-770d0aa7.westus2.azurecontainerapps.io"

// Helper functions for headers
export const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getAuthHeadersUpload = (token) => ({
  Authorization: `Bearer ${token}`,
});

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Authentication API calls
export async function login(email, password) {
  const data = await apiCall("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (data.success) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    return data.data;
  }

  throw new Error(data.error);
}

export async function signup(userData) {
  const data = await apiCall("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (data.success) {
    return data.data;
  }

  throw new Error(data.error);
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await apiCall("/auth/users/me", {
    headers: getAuthHeaders(token),
  });
}

export async function createCreator(userData) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await apiCall("/auth/creators", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData),
  });
}

// Video API calls
export async function uploadVideo(
  videoFile,
  title,
  description,
  isPublic = true
) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("isPublic", isPublic);

  return await apiCall("/videos", {
    method: "POST",
    headers: getAuthHeadersUpload(token),
    body: formData,
  });
}

export async function getVideos(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/videos${queryString ? `?${queryString}` : ""}`;

  return await apiCall(endpoint);
}

export async function getVideo(id) {
  return await apiCall(`/videos/${id}`);
}

export async function updateVideo(id, updates) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await apiCall(`/videos/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updates),
  });
}

export async function deleteVideo(id) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await apiCall(`/videos/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}

export function getVideoStreamUrl(id) {
  return `${API_BASE_URL}/videos/${id}/stream`;
}

// Comments API calls
export async function addComment(videoId, content) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await apiCall(`/videos/${videoId}/comments`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ content }),
  });
}

export async function getComments(videoId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/videos/${videoId}/comments${
    queryString ? `?${queryString}` : ""
  }`;

  return await apiCall(endpoint);
}

// Ratings API calls
export async function addRating(videoId, rating, comment) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await apiCall(`/videos/${videoId}/ratings`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ rating, comment }),
  });
}

export async function getRatings(videoId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/videos/${videoId}/ratings${
    queryString ? `?${queryString}` : ""
  }`;

  return await apiCall(endpoint);
}

export async function getRatingStats(videoId) {
  return await apiCall(`/videos/${videoId}/ratings/stats`);
}

// Dashboard API calls
export async function getLatestVideos(limit = 10) {
  return await apiCall(`/dashboard/latest?limit=${limit}`);
}

export async function getDashboardStats() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  return await apiCall("/dashboard/stats", {
    headers: getAuthHeaders(token),
  });
}
