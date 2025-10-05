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
      if (isAuthenticated()) {
        try {
          const user = await getCurrentUser();
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        } catch (error) {
          console.error("Failed to get current user:", error);
          // Token might be invalid, remove it
          logoutUser();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login action
  const login = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      // The actual login API call should be handled in the component
      // This function just updates the state with the user data
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: userData });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message });
      throw error;
    }
  };

  // Logout action
  const logout = () => {
    logoutUser();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user data
  const updateUser = (userData) => {
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
