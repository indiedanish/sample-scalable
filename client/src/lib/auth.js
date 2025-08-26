// Authentication utilities
export function getStoredUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getStoredToken();
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export function hasRole(requiredRole) {
  const user = getStoredUser();
  if (!user) return false;

  const roleHierarchy = {
    CONSUMER: 1,
    CREATOR: 2,
    ADMIN: 3,
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

export function canUploadVideos() {
  return hasRole("CREATOR");
}

export function canManageUsers() {
  return hasRole("ADMIN");
}

export function canEditVideo(video) {
  const user = getStoredUser();
  if (!user) return false;

  // Admins can edit any video
  if (user.role === "ADMIN") return true;

  // Creators can edit their own videos
  if (
    user.role === "CREATOR" &&
    video.creator &&
    video.creator.id === user.id
  ) {
    return true;
  }

  return false;
}
