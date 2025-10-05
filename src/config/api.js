// API Configuration
const API_BASE_URL = "/api"; // Use proxy instead of direct URL

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem("auth_token", token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem("auth_token");
};

// Base API function for making requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    mode: "cors", // Explicitly set CORS mode
    credentials: "omit", // Don't send credentials to avoid CORS issues
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log(`Making API request to: ${url}`, {
      method: config.method || "GET",
      headers: config.headers,
    });

    // Add detailed fetch debugging
    console.log("About to call fetch with config:", config);

    const response = await fetch(url, config).catch((fetchError) => {
      console.error("Fetch failed:", {
        error: fetchError,
        message: fetchError.message,
        stack: fetchError.stack,
        url: url,
        config: config,
      });
      throw fetchError;
    });

    console.log("Fetch successful, processing response...");

    // Handle non-JSON responses for file uploads
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log(`API Response for ${endpoint}:`, {
      status: response.status,
      data,
    });

    if (!response.ok) {
      const errorMessage =
        data.message ||
        data.msg ||
        data.error ||
        data ||
        `HTTP error! status: ${response.status}`;

      // Special handling for authorization errors
      if (response.status === 401) {
        console.warn("Unauthorized request - token may be invalid or expired");
        // Remove invalid token
        removeAuthToken();
      }

      console.error(`API Error for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        url: url,
      });

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", { url, error: error.message, config });
    throw error;
  }
};

// Specialized function for form data requests (file uploads)
const apiFormRequest = async (endpoint, formData, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const defaultHeaders = {};

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: "POST",
    headers: defaultHeaders,
    body: formData,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Form Request Error:", error);
    throw error;
  }
};

export {
  API_BASE_URL,
  apiRequest,
  apiFormRequest,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
};
