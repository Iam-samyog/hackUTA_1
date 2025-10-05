import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getCurrentUser,
  isAuthenticated,
  logoutUser,
} from "../services/authService.js";

// Create Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  SET_LOADING: "SET_LOADING",
};

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("Checking auth status...");

      if (isAuthenticated()) {
        console.log("Token found, checking for stored user data...");

        // Try to get user data from localStorage first
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log("User data found in localStorage:", userData);
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
            return;
          } catch (parseError) {
            console.error("Failed to parse stored user data:", parseError);
            localStorage.removeItem("user_data");
          }
        }

        // If no stored user data, try to fetch from server (fallback)
        console.log("No stored user data, trying server...");
        try {
          const user = await getCurrentUser();
          console.log("User verified from server:", user);
          // Store the user data for future use
          localStorage.setItem("user_data", JSON.stringify(user));
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        } catch (error) {
          console.error("Failed to get current user:", error);

          // Try stats API as alternative for user data
          try {
            console.log("Trying stats API as fallback for user data...");
            const { getUserStats } = await import(
              "../services/statsService.js"
            );
            const statsData = await getUserStats();
            if (statsData && statsData.username) {
              const userFromStats = {
                username: statsData.username,
                name: statsData.full_name || statsData.username,
                full_name: statsData.full_name,
                id: statsData.user_id,
                ...statsData,
              };
              console.log("User data loaded from stats API:", userFromStats);
              localStorage.setItem("user_data", JSON.stringify(userFromStats));
              dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userFromStats });
              return;
            }
          } catch (statsError) {
            console.warn("Stats API fallback also failed:", statsError);
          }

          // Check if it's a network error (Failed to fetch) vs auth error (401, 403)
          if (
            error.message.includes("Failed to fetch") ||
            error.message.includes("NetworkError")
          ) {
            console.warn(
              "Network error during auth check - keeping user logged in offline"
            );
            // Keep the user authenticated but without user data
            // They can try again later or when network is restored
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          } else {
            // Actual auth error - token might be invalid
            console.warn("Authentication error - logging out user");
            logoutUser();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        }
      } else {
        console.log("No token found");
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login action
  const login = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      console.log("AuthContext login called with:", userData);

      // Handle token storage
      if (userData.token) {
        localStorage.setItem("auth_token", userData.token);
        console.log("Token stored:", userData.token.substring(0, 20) + "...");
      } else if (userData.access_token) {
        localStorage.setItem("auth_token", userData.access_token);
        console.log(
          "Access token stored:",
          userData.access_token.substring(0, 20) + "..."
        );
      }

      // Extract user data - try different possible structures
      let user = userData.user || userData.data;

      // If we have user data in the response, use it
      if (user && (user.id || user.user_id || user.username || user.email)) {
        console.log("User data found in response:", user);
        // Store user data in localStorage
        localStorage.setItem("user_data", JSON.stringify(user));
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      }
      // If we only have tokens, try to fetch user data from the server
      else if (userData.access_token || userData.token) {
        console.log(
          "Only tokens received, trying to fetch user data from server..."
        );
        try {
          const fetchedUser = await getCurrentUser();
          console.log("Fetched user data:", fetchedUser);
          // Store user data in localStorage
          localStorage.setItem("user_data", JSON.stringify(fetchedUser));
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: fetchedUser });
        } catch (fetchError) {
          console.error("Failed to fetch user data after login:", fetchError);
          console.log(
            "Proceeding with login without user data - will be available after refresh"
          );
          // If we can't fetch user data, still mark as authenticated but with null user
          // The user will be fetched on next app load
          dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: null });
        }
      }
      // If no valid data found
      else {
        console.error(
          "No valid token or user data found in response:",
          userData
        );
        throw new Error("Invalid login response - no token received");
      }
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message });
      throw error;
    }
  };

  // Logout action
  const logout = () => {
    logoutUser();
    // Clear user data from localStorage
    localStorage.removeItem("user_data");
    console.log("User data cleared from localStorage");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user data
  const updateUser = (userData) => {
    // Store updated user data in localStorage
    localStorage.setItem("user_data", JSON.stringify(userData));
    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: userData });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: null });
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
