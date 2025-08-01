import axios from "axios";
import API, { apiHelpers } from "./api.js";
import { apiConfig, authConfig, isDevelopment } from "../config.js";

// Auth endpoints - using config
const AUTH_ENDPOINTS = {
  LOGIN: `${apiConfig.apiPrefix}/auth/login`,
  SIGNUP: `${apiConfig.apiPrefix}/auth/signup`,
  REGISTER: `${apiConfig.apiPrefix}/auth/register`,
  LOGOUT: `${apiConfig.apiPrefix}/auth/logout`,
  REFRESH: `${apiConfig.apiPrefix}/auth/refresh`,
  FORGOT_PASSWORD: `${apiConfig.apiPrefix}/auth/forgot-password`,
  RESET_PASSWORD: `${apiConfig.apiPrefix}/auth/reset-password`,
  VERIFY_EMAIL: `${apiConfig.apiPrefix}/auth/verify-email`,
  CHANGE_PASSWORD: `${apiConfig.apiPrefix}/auth/change-password`,
};

// User endpoints - using config
const USER_ENDPOINTS = {
  PROFILE: `${apiConfig.apiPrefix}/user/profile`,
  UPDATE_PROFILE: `${apiConfig.apiPrefix}/user/profile`,
  DELETE_ACCOUNT: `${apiConfig.apiPrefix}/user/account`,
};

// Create a separate axios instance for auth endpoints without interceptors
const authAPI = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: authConfig.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API error handler
const handleAuthError = (error, operation) => {
  const errorMessage = error.response?.data?.message || error.message;
  const statusCode = error.response?.status;

  if (isDevelopment()) {
    console.error(`${operation} failed:`, {
      message: errorMessage,
      status: statusCode,
      data: error.response?.data,
    });
  }

  // Create a standardized error object
  const authError = new Error(errorMessage);
  authError.status = statusCode;
  authError.data = error.response?.data;
  authError.operation = operation;

  throw authError;
};

// Validate auth form data
const validateAuthData = (data, requiredFields) => {
  const missing = requiredFields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
};

// Authentication methods
export const login = async (credentials) => {
  try {
    validateAuthData(credentials, ["email", "password"]);

    // Debug logging - only in development
    if (isDevelopment()) {
      console.log(
        "Attempting login to:",
        apiConfig.baseUrl + AUTH_ENDPOINTS.LOGIN
      );
    }

    const response = await authAPI.post(AUTH_ENDPOINTS.LOGIN, credentials);

    // Handle different possible response structures
    const responseData = response.data;
    const token =
      responseData.token || responseData.accessToken || responseData.authToken;
    const user = responseData.user || responseData.userInfo;
    const refreshToken = responseData.refreshToken;
    const expiresIn = responseData.expiresIn || responseData.expires_in;

    // Store authentication data
    if (token) {
      if (isDevelopment()) {
        console.log("Login successful, storing token");
      }
      apiHelpers.setToken(token);

      // Store additional auth data if available
      if (refreshToken) {
        localStorage.setItem(authConfig.refreshTokenKey, refreshToken);
      }

      if (expiresIn) {
        const expiryTime = Date.now() + expiresIn * 1000;
        localStorage.setItem(authConfig.tokenExpiryKey, expiryTime.toString());
      }

      if (user) {
        localStorage.setItem(authConfig.userKey, JSON.stringify(user));
      }

      // Verify token was stored correctly
      const storedToken = apiHelpers.getToken();
      if (isDevelopment()) {
        console.log("Token stored successfully:", !!storedToken);
      }

      return responseData;
    } else {
      throw new Error("No token received from server");
    }
  } catch (error) {
    handleAuthError(error, "Login");
  }
};

export const signup = async (userData) => {
  try {
    validateAuthData(userData, ["email", "password"]);

    const response = await authAPI.post(AUTH_ENDPOINTS.SIGNUP, userData);

    // Auto-login after successful signup if token is provided
    const responseData = response.data;
    const token =
      responseData.token || responseData.accessToken || responseData.authToken;
    const user = responseData.user || responseData.userInfo;
    const refreshToken = responseData.refreshToken;

    if (token) {
      apiHelpers.setToken(token);
      if (refreshToken) {
        localStorage.setItem(authConfig.refreshTokenKey, refreshToken);
      }
      if (user) {
        localStorage.setItem(authConfig.userKey, JSON.stringify(user));
      }
    }

    return responseData;
  } catch (error) {
    handleAuthError(error, "Signup");
  }
};

export const register = async (userData) => {
  try {
    validateAuthData(userData, ["email", "password", "firstName", "lastName"]);

    const response = await authAPI.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    handleAuthError(error, "Registration");
  }
};

export const logout = async () => {
  try {
    // Call logout endpoint if available
    if (apiHelpers.isAuthenticated()) {
      await API.post(AUTH_ENDPOINTS.LOGOUT);
    }
  } catch (error) {
    if (isDevelopment()) {
      console.warn("Logout endpoint failed:", error.message);
    }
  } finally {
    // Always clear local storage
    clearAuthData();
  }
};

export const forgotPassword = async (email) => {
  try {
    validateAuthData({ email }, ["email"]);

    const response = await authAPI.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  } catch (error) {
    handleAuthError(error, "Forgot Password");
  }
};

export const resetPassword = async (resetData) => {
  try {
    validateAuthData(resetData, ["token", "password"]);

    const response = await authAPI.post(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      resetData
    );
    return response.data;
  } catch (error) {
    handleAuthError(error, "Reset Password");
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem(authConfig.refreshTokenKey);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await authAPI.post(AUTH_ENDPOINTS.REFRESH, {
      refreshToken,
    });

    const responseData = response.data;
    const token =
      responseData.token || responseData.accessToken || responseData.authToken;
    const expiresIn = responseData.expiresIn || responseData.expires_in;

    if (token) {
      apiHelpers.setToken(token);
      if (expiresIn) {
        const expiryTime = Date.now() + expiresIn * 1000;
        localStorage.setItem(authConfig.tokenExpiryKey, expiryTime.toString());
      }
    }

    return responseData;
  } catch (error) {
    // If refresh fails, clear all auth data
    clearAuthData();
    handleAuthError(error, "Token Refresh");
  }
};

// Protected user methods
export const getProfile = async () => {
  try {
    const response = await API.get(USER_ENDPOINTS.PROFILE);
    return response.data;
  } catch (error) {
    handleAuthError(error, "Get Profile");
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await API.put(USER_ENDPOINTS.UPDATE_PROFILE, profileData);

    // Update stored user data
    const updatedUser = response.data.user || response.data;
    if (updatedUser) {
      localStorage.setItem(authConfig.userKey, JSON.stringify(updatedUser));
    }

    return response.data;
  } catch (error) {
    handleAuthError(error, "Update Profile");
  }
};

export const changePassword = async (passwordData) => {
  try {
    validateAuthData(passwordData, ["currentPassword", "newPassword"]);

    const response = await API.put(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      passwordData
    );
    return response.data;
  } catch (error) {
    handleAuthError(error, "Change Password");
  }
};

export const deleteAccount = async () => {
  try {
    const response = await API.delete(USER_ENDPOINTS.DELETE_ACCOUNT);
    clearAuthData();
    return response.data;
  } catch (error) {
    handleAuthError(error, "Delete Account");
  }
};

// Utility functions
export const clearAuthData = () => {
  apiHelpers.clearToken();
  localStorage.removeItem(authConfig.refreshTokenKey);
  localStorage.removeItem(authConfig.tokenExpiryKey);
  localStorage.removeItem(authConfig.userKey);
  if (isDevelopment()) {
    console.log("Auth data cleared");
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(authConfig.userKey);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    if (isDevelopment()) {
      console.warn("Failed to parse stored user data:", error);
    }
    return null;
  }
};

export const isTokenExpired = () => {
  try {
    const expiryStr = localStorage.getItem(authConfig.tokenExpiryKey);
    if (!expiryStr) return false;

    const expiry = parseInt(expiryStr);
    return Date.now() > expiry - authConfig.tokenExpiryBuffer;
  } catch (error) {
    if (isDevelopment()) {
      console.warn("Failed to check token expiry:", error);
    }
    return false;
  }
};

export const ensureValidToken = async () => {
  if (!apiHelpers.isAuthenticated()) {
    throw new Error("Not authenticated");
  }

  if (isTokenExpired()) {
    try {
      await refreshToken();
    } catch (error) {
      clearAuthData();
      throw new Error("Session expired");
    }
  }
};

// Auth status checker
export const getAuthStatus = () => {
  const isAuthenticated = apiHelpers.isAuthenticated();
  const user = getCurrentUser();
  const isExpired = isTokenExpired();
  const token = apiHelpers.getToken();

  // Debug logging - only in development
  if (isDevelopment()) {
    console.log("Auth Status Debug:", {
      isAuthenticated,
      hasUser: !!user,
      isExpired,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenStart: token?.substring(0, 20) || "none",
      storageKeys: Object.keys(localStorage).filter(
        (key) =>
          key.includes("token") ||
          key.includes("auth") ||
          key === authConfig.userKey
      ),
    });
  }

  return {
    isAuthenticated,
    user,
    isTokenExpired: isExpired,
    hasValidToken: isAuthenticated && !isExpired,
  };
};

// Email verification
export const verifyEmail = async (verificationData) => {
  try {
    validateAuthData(verificationData, ["token"]);

    const response = await authAPI.post(
      AUTH_ENDPOINTS.VERIFY_EMAIL,
      verificationData
    );
    return response.data;
  } catch (error) {
    handleAuthError(error, "Email Verification");
  }
};

// TEST FUNCTIONS - Only available in development
export const testAuth = () => {
  if (!isDevelopment()) return;

  console.log("=== AUTH DEBUG INFO ===");
  console.log(
    "Current token:",
    apiHelpers.getToken()?.substring(0, 50) + "..."
  );
  console.log("Is authenticated:", apiHelpers.isAuthenticated());
  console.log("Current user:", getCurrentUser());
  console.log("Token expired:", isTokenExpired());
  console.log("Auth status:", getAuthStatus());
  console.log("LocalStorage keys:", Object.keys(localStorage));
  console.log("=======================");
};

// Quick login for testing - Only available in development
export const quickTestLogin = async (testCredentials = null) => {
  if (!isDevelopment()) {
    throw new Error("Test functions only available in development mode");
  }

  try {
    // Use provided credentials or default test credentials
    const credentials = testCredentials || {
      email: "test@example.com",
      password: "password123",
    };

    console.log("Attempting quick test login...");
    const result = await login(credentials);
    console.log("Test login successful:", result);
    testAuth(); // Show debug info after login
    return result;
  } catch (error) {
    console.error("Test login failed:", error);
    throw error;
  }
};

// Export auth service object for easier testing and mocking
export const authService = {
  login,
  signup,
  register,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  verifyEmail,
  clearAuthData,
  getCurrentUser,
  isTokenExpired,
  ensureValidToken,
  getAuthStatus,
  ...(isDevelopment() && { testAuth, quickTestLogin }), // Only include test functions in development
};

export default authService;
