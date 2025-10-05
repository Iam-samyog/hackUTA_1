import { apiRequest } from "../config/api.js";

// Get all tags with pagination
export const getAllTags = async (page = 1, perPage = 10) => {
  try {
    return await apiRequest(`/tags/?page=${page}&per_page=${perPage}`);
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

// Create a new tag
export const createTag = async (tagName) => {
  try {
    return await apiRequest("/tags/", {
      method: "POST",
      body: JSON.stringify({ name: tagName }),
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

// Get tag details
export const getTagById = async (tagId) => {
  try {
    return await apiRequest(`/tags/${tagId}`);
  } catch (error) {
    console.error("Error fetching tag:", error);
    throw error;
  }
};

// Delete a tag
export const deleteTag = async (tagId) => {
  try {
    return await apiRequest(`/tags/${tagId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
};

// Get notes with specific tag
export const getNotesWithTag = async (tagId, page = 1, perPage = 10) => {
  try {
    return await apiRequest(
      `/tags/${tagId}/notes?page=${page}&per_page=${perPage}`
    );
  } catch (error) {
    console.error("Error fetching notes with tag:", error);
    throw error;
  }
};

// Get popular tags
export const getPopularTags = async (limit = 10) => {
  try {
    return await apiRequest(`/tags/popular?limit=${limit}`);
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    throw error;
  }
};
