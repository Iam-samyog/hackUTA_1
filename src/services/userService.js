import { apiRequest } from "../config/api.js";

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
