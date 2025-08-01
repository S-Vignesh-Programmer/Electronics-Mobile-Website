import axios from "axios";
import { apiConfig, features, isDevelopment } from "../config.js";

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
];

// Methods that need Content-Type
const CONTENT_TYPE_METHODS = ["post", "put", "patch"];

// Axios instance
const API = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout || 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// === Utils ===
const getStoredToken = () => {
  try {
    return localStorage.getItem(apiConfig.tokenKey);
  } catch (error) {
    if (features.enableLogging) {
      console.warn("LocalStorage access error:", error);
    }
    return null;
  }
};

const isPublicEndpoint = (url = "") => {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const requiresContentType = (method = "") => {
  return CONTENT_TYPE_METHODS.includes(method.toLowerCase());
};

// === Request Interceptor ===
API.interceptors.request.use(
  (config) => {
    try {
      const token = getStoredToken();
      const isPublic = isPublicEndpoint(config.url);

      // Debug logging - only when logging is enabled
      if (features.enableLogging) {
        console.log("Request Debug:", {
          url: config.url,
          method: config.method,
          isPublic,
          hasToken: !!token,
          fullUrl: config.baseURL + config.url,
        });
      }

      // Add JSON Content-Type if needed
      if (requiresContentType(config.method)) {
        config.headers["Content-Type"] = "application/json";
      }

      // Add Bearer token for protected routes
      if (token && !isPublic) {
        config.headers["Authorization"] = `Bearer ${token}`;
        if (features.enableLogging) {
          console.log(
            "Added Authorization header:",
            `Bearer ${token.substring(0, 20)}...`
          );
        }
      } else if (!isPublic && features.enableLogging) {
        console.warn("No token available for protected route:", config.url);
      }

      // Development-only: log request start time
      if (features.enableDebugMode) {
        config.metadata = { startTime: new Date() };
      }

      return config;
    } catch (err) {
      if (features.enableLogging) {
        console.error("Request setup error:", err);
      }
      return config;
    }
  },
  (error) => {
    if (features.enableLogging) {
      console.error("Request error:", error);
    }
    return Promise.reject(error);
  }
);

// === Response Interceptor ===
API.interceptors.response.use(
  (response) => {
    // Log API duration - when debug mode is enabled
    if (features.enableDebugMode && response.config.metadata?.startTime) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(
        `[API ${response.config.method?.toUpperCase()}] ${
          response.config.url
        } took ${duration}ms`
      );
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      if (features.enableLogging) {
        console.error(
          `[API Error] ${config.method?.toUpperCase()} ${config.url}:`,
          {
            status,
            message: data?.message || error.message,
            data,
          }
        );
      }

      switch (status) {
        case 401:
          if (features.enableLogging) {
            console.warn("Unauthorized - clearing auth data and redirecting");
          }
          localStorage.removeItem(apiConfig.tokenKey);
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;
        case 403:
          if (features.enableLogging) {
            console.error("Forbidden:", data?.message || "Access denied");
          }
          break;
        case 404:
          if (features.enableLogging) {
            console.error("Not found:", config.url);
          }
          break;
        case 429:
          if (features.enableLogging) {
            console.error("Rate limit hit. Try again later.");
          }
          break;
        case 500:
          if (features.enableLogging) {
            console.error("Server error. Please try again.");
          }
          break;
        default:
          if (features.enableLogging) {
            console.error("API Error:", data?.message || error.message);
          }
      }
    } else if (error.request) {
      if (features.enableLogging) {
        console.error("No response from server:", error.message);
      }
    } else {
      if (features.enableLogging) {
        console.error("Axios config error:", error.message);
      }
    }
    return Promise.reject(error);
  }
);

// === Helpers ===
export const apiHelpers = {
  setToken: (token) => {
    try {
      localStorage.setItem(apiConfig.tokenKey, token);
      if (features.enableLogging) {
        console.log("Token stored successfully");
      }
    } catch (e) {
      if (features.enableLogging) {
        console.warn("Failed to set token:", e);
      }
    }
  },
  clearToken: () => {
    try {
      localStorage.removeItem(apiConfig.tokenKey);
      if (features.enableLogging) {
        console.log("Token cleared");
      }
    } catch (e) {
      if (features.enableLogging) {
        console.warn("Failed to clear token:", e);
      }
    }
  },
  getToken: () => {
    return getStoredToken();
  },
  isAuthenticated: () => {
    const hasToken = !!getStoredToken();
    if (features.enableLogging) {
      console.log("Authentication check:", hasToken);
    }
    return hasToken;
  },
  withHeaders: (headers = {}) => ({
    headers: {
      ...API.defaults.headers,
      ...headers,
    },
  }),
};

export default API;
