import { apiRequest } from "../config/api.js";

// Get current user profile (for authenticated user)
export const getCurrentUserProfile = async () => {
  try {
    // First try to get from localStorage if server endpoint doesn't exist
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Retrieved user profile from localStorage:", userData);
      return userData;
    }

    // Fallback to server request
    const response = await apiRequest("/auth/me", {
      method: "GET",
    });
    return response;
  } catch (error) {
    // If server request fails, try localStorage as backup
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Server request failed, using localStorage data:", userData);
      return userData;
    }
    throw error;
  }
};

// Update current user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiRequest("/auth/me", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await apiRequest("/users", {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get user profile by username
export const getUserProfile = async (username) => {
  try {
    // If no username provided, get current user profile
    if (!username) {
      return await getCurrentUserProfile();
    }

    const response = await apiRequest(`/users/${username}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Follow a user
export const followUser = async (username) => {
  try {
    const response = await apiRequest(`/users/${username}/follow`, {
      method: "POST",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (username) => {
  try {
    const response = await apiRequest(`/users/${username}/unfollow`, {
      method: "POST",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get recommended users to follow
export const getRecommendedUsers = async (limit = 10) => {
  try {
    const response = await apiRequest(`/users/recommendations?limit=${limit}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};
