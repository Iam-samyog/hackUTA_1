import { apiRequest } from '../config/api.js';

// Get note statistics
export const getNoteStats = async (notePublicId) => {
  try {
    return await apiRequest(`/notes/${notePublicId}/stats`);
  } catch (error) {
    console.error('Error fetching note stats:', error);
    throw error;
  }
};

// Get user statistics (requires auth)
export const getUserStats = async () => {
  try {
    return await apiRequest('/users/me/stats');
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};
