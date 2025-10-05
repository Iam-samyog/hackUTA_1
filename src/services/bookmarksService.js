import { apiRequest } from '../config/api.js';

// Bookmark a note
export const bookmarkNote = async (notePublicId) => {
  try {
    return await apiRequest(`/notes/${notePublicId}/bookmark`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error bookmarking note:', error);
    throw error;
  }
};

// Remove bookmark from a note
export const removeBookmark = async (notePublicId) => {
  try {
    return await apiRequest(`/notes/${notePublicId}/bookmark`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

// Get user's bookmarked notes
export const getUserBookmarks = async (page = 1, perPage = 10) => {
  try {
    return await apiRequest(`/users/me/bookmarks?page=${page}&per_page=${perPage}`);
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    throw error;
  }
};

// Toggle bookmark (bookmark if not bookmarked, remove if already bookmarked)
export const toggleBookmark = async (notePublicId) => {
  try {
    // Try to bookmark first
    return await bookmarkNote(notePublicId);
  } catch (error) {
    // If already bookmarked, remove the bookmark
    if (error.message.includes('already bookmarked')) {
      return await removeBookmark(notePublicId);
    }
    throw error;
  }
};
