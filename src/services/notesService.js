import { apiRequest, apiFormRequest } from "../config/api.js";

// Get all public notes
export const getPublicNotes = async () => {
  try {
    const response = await apiRequest("/notes", {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get a specific note by public_id
export const getNoteById = async (publicId) => {
  try {
    const response = await apiRequest(`/notes/${publicId}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a new note
export const createNote = async (noteData) => {
  try {
    const formData = new FormData();
    formData.append("title", noteData.title);
    formData.append("description", noteData.description);
    formData.append("is_public", noteData.is_public);
    if (noteData.file) {
      formData.append("file", noteData.file);
    }

    const response = await apiFormRequest("/notes", formData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update a note
export const updateNote = async (publicId, noteData) => {
  try {
    const response = await apiRequest(`/notes/${publicId}`, {
      method: "PUT",
      body: JSON.stringify(noteData),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete a note
export const deleteNote = async (publicId) => {
  try {
    const response = await apiRequest(`/notes/${publicId}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all collaborators for a note
export const getNoteCollaborators = async (publicId) => {
  try {
    const response = await apiRequest(`/notes/${publicId}/collaborators`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Add a collaborator to a note
export const addCollaborator = async (publicId, username) => {
  try {
    const response = await apiRequest(`/notes/${publicId}/collaborators`, {
      method: "POST",
      body: JSON.stringify({ username }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all comments for a note
export const getNoteComments = async (publicId) => {
  try {
    const response = await apiRequest(`/notes/${publicId}/comments`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Add a comment to a note
export const addComment = async (publicId, content) => {
  try {
    const response = await apiRequest(`/notes/${publicId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// React to a note (toggle reaction)
export const toggleReaction = async (publicId, reactionType) => {
  try {
    const response = await apiRequest(`/notes/${publicId}/react`, {
      method: "POST",
      body: JSON.stringify({ reaction_type: reactionType }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get reaction counts for a note
export const getNoteReactions = async (publicId) => {
  try {
    const response = await apiRequest(`/notes/${publicId}/react`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};
