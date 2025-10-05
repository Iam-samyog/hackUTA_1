import { apiRequest, setAuthToken, removeAuthToken } from "../config/api.js";

// User Registration
export const registerUser = async (userData) => {
  try {
    const response = await apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Assuming the backend returns a token on successful registration
    console.log("Full registration response:", response);

    if (response.token) {
      console.log(
        "Storing registration token:",
        response.token.substring(0, 20) + "..."
      );
      setAuthToken(response.token);
    } else if (response.access_token) {
      console.log(
        "Storing registration access_token:",
        response.access_token.substring(0, 20) + "..."
      );
      setAuthToken(response.access_token);
    } else {
      console.warn(
        "No token found in registration response. Response keys:",
        Object.keys(response)
      );
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// User Login
export const loginUser = async (credentials) => {
  try {
    // Try multiple possible login endpoints
    let response;
    try {
      response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      // If /auth/login fails, try /login
      if (
        error.message.includes("404") ||
        error.message.includes("Not Found")
      ) {
        response = await apiRequest("/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
      } else {
        throw error;
      }
    }

    // Store the token if login is successful
    console.log("Full login response:", response);

    if (response.token) {
      console.log("Storing token:", response.token.substring(0, 20) + "...");
      setAuthToken(response.token);
    } else if (response.access_token) {
      console.log(
        "Storing access_token:",
        response.access_token.substring(0, 20) + "..."
      );
      // Some APIs use access_token instead of token
      setAuthToken(response.access_token);
    } else {
      console.warn(
        "No token found in response. Response keys:",
        Object.keys(response)
      );
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
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
    console.log("Attempting to get current user...");
    let response;

    // Try multiple possible endpoints for getting current user
    try {
      response = await apiRequest("/auth/me", {
        method: "GET",
      });
    } catch (error) {
      console.warn(
        "Failed to get user from /auth/me, trying /me...",
        error.message
      );
      if (
        error.message.includes("404") ||
        error.message.includes("Not Found")
      ) {
        response = await apiRequest("/me", {
          method: "GET",
        });
      } else {
        throw error;
      }
    }

    console.log("Successfully retrieved current user:", response);
    return response;
  } catch (error) {
    console.error("Failed to get current user:", error);
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
