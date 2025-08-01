// config.js - Fixed version
const getEnvVar = (key, defaultValue = "") => {
  try {
    // For Vite (if using Vite)
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return import.meta.env[key] ?? defaultValue;
    }

    // For Create React App or Node.js
    if (typeof process !== "undefined" && process.env) {
      return process.env[key] ?? defaultValue;
    }

    // Check for window-injected env vars
    if (typeof window !== "undefined" && window.__ENV__) {
      return window.__ENV__[key] || defaultValue;
    }

    return defaultValue;
  } catch (error) {
    console.warn(`Failed to get environment variable ${key}:`, error);
    return defaultValue;
  }
};

// Environment detection
const environment = getEnvVar("NODE_ENV", "development");
const isDevelopment = environment === "development";
const isProduction = environment === "production";

// Dynamic API URL based on deployment
const getApiBaseUrl = () => {
  // Try both Vite and React App prefixes
  const viteUrl = getEnvVar("VITE_API_BASE_URL");
  const reactUrl = getEnvVar("REACT_APP_API_BASE_URL");

  if (viteUrl) return viteUrl;
  if (reactUrl) return reactUrl;

  // Auto-detect based on current location
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8080/api";
    }

    // For your Vercel deployment, use your Render backend URL
    if (hostname === "electronics-mobile-website.vercel.app") {
      return "https://your-render-app-name.onrender.com/api"; // Replace with actual URL
    }
  }

  // Default fallback
  return isDevelopment
    ? "http://localhost:8080/api"
    : "https://your-render-app-name.onrender.com/api"; // Replace with actual URL
};

// API Configuration
export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  timeout: parseInt(
    getEnvVar("VITE_API_TIMEOUT") || getEnvVar("REACT_APP_API_TIMEOUT", "10000")
  ),
  tokenKey:
    getEnvVar("VITE_TOKEN_KEY") || getEnvVar("REACT_APP_TOKEN_KEY", "token"),
};

// Auth Configuration
export const authConfig = {
  timeout: parseInt(
    getEnvVar("VITE_AUTH_TIMEOUT") ||
      getEnvVar("REACT_APP_AUTH_TIMEOUT", "15000")
  ),
  tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes
  refreshTokenKey:
    getEnvVar("VITE_REFRESH_TOKEN_KEY") ||
    getEnvVar("REACT_APP_REFRESH_TOKEN_KEY", "refreshToken"),
};

// App Configuration
export const appConfig = {
  name:
    getEnvVar("VITE_APP_NAME") || getEnvVar("REACT_APP_NAME", "ElectroMart"),
  version:
    getEnvVar("VITE_APP_VERSION") || getEnvVar("REACT_APP_VERSION", "1.0.0"),
  environment: environment,
};

// Feature flags
export const features = {
  enableLogging:
    (getEnvVar("VITE_ENABLE_LOGGING") ||
      getEnvVar(
        "REACT_APP_ENABLE_LOGGING",
        isDevelopment ? "true" : "false"
      )) === "true",
  enableAnalytics:
    (getEnvVar("VITE_ENABLE_ANALYTICS") ||
      getEnvVar("REACT_APP_ENABLE_ANALYTICS", "false")) === "true",
  enableDebugMode:
    (getEnvVar("VITE_DEBUG_MODE") ||
      getEnvVar("REACT_APP_DEBUG_MODE", isDevelopment ? "true" : "false")) ===
    "true",
};

// Export environment flags
export { isDevelopment, isProduction };

// Main config object
export const config = {
  api: apiConfig,
  auth: authConfig,
  app: appConfig,
  features,
};

export default config;
