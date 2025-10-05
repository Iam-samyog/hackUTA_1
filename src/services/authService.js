import { apiRequest, setAuthToken, removeAuthToken } from "../config/api.js";

// User Registration
export const registerUser = async (userData) => {
  try {
    const response = await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Assuming the backend returns a token on successful registration
    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// User Login
export const loginUser = async (credentials) => {
  try {
    // The API endpoint for login isn't specified in your docs,
    // I'm assuming it follows REST conventions like /auth/login
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store the token if login is successful
    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// User Logout
export const logoutUser = () => {
  removeAuthToken();
  // You might want to also call an API endpoint to invalidate the token on the server
  // await apiRequest('/auth/logout', { method: 'POST' });
};

// Get Current User Profile
export const getCurrentUser = async () => {
  try {
    const response = await apiRequest("/auth/me", {
      method: "GET",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("auth_token");
  return !!token;
};

// Refresh Token (if your backend supports it)
export const refreshToken = async () => {
  try {
    const response = await apiRequest("/auth/refresh", {
      method: "POST",
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};
