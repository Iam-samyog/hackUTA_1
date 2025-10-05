import { apiRequest } from '../config/api.js';

// Search notes with advanced filters
export const searchNotes = async (searchParams = {}) => {
  try {
    const queryString = new URLSearchParams();
    
    // Add search parameters
    if (searchParams.q) queryString.append('q', searchParams.q);
    if (searchParams.tags) queryString.append('tags', searchParams.tags);
    if (searchParams.course) queryString.append('course', searchParams.course);
    if (searchParams.owner) queryString.append('owner', searchParams.owner);
    if (searchParams.is_public !== undefined) queryString.append('is_public', searchParams.is_public);
    if (searchParams.page) queryString.append('page', searchParams.page);
    if (searchParams.per_page) queryString.append('per_page', searchParams.per_page);
    
    return await apiRequest(`/notes/search?${queryString.toString()}`);
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
};

// Get personalized recommendations (requires auth)
export const getRecommendedNotes = async (page = 1, perPage = 10) => {
  try {
    return await apiRequest(`/notes/recommended?page=${page}&per_page=${perPage}`);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};
