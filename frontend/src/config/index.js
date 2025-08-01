// src/config/index.js

// Safe environment variable getter
const getEnvVar = (key, defaultValue = "") => {
  try {
    // Check if we're in a browser environment with webpack-injected env vars
    if (typeof window !== "undefined" && window.__ENV__) {
      return window.__ENV__[key] || defaultValue;
    }

    // Check for process.env (Node.js or webpack DefinePlugin)
    if (typeof process !== "undefined" && process.env) {
      return process.env[key] || defaultValue;
    }

    return defaultValue;
  } catch (error) {
    console.warn(`Failed to get environment variable ${key}:`, error);
    return defaultValue;
  }
};

// Application configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: getEnvVar("REACT_APP_API_BASE_URL", "http://localhost:8080/api"),
    timeout: parseInt(getEnvVar("REACT_APP_API_TIMEOUT", "10000")),
    tokenKey: getEnvVar("REACT_APP_TOKEN_KEY", "token"),
  },

  // Auth Configuration
  auth: {
    timeout: parseInt(getEnvVar("REACT_APP_AUTH_TIMEOUT", "15000")),
    tokenExpiryBuffer: 5 * 60 * 1000, // 5 minutes
    refreshTokenKey: getEnvVar("REACT_APP_REFRESH_TOKEN_KEY", "refreshToken"),
  },

  // App Configuration
  app: {
    name: getEnvVar("REACT_APP_NAME", "My App"),
    version: getEnvVar("REACT_APP_VERSION", "1.0.0"),
    environment: getEnvVar("NODE_ENV", "development"),
  },

  // Feature flags
  features: {
    enableLogging: getEnvVar("REACT_APP_ENABLE_LOGGING", "true") === "true",
    enableAnalytics:
      getEnvVar("REACT_APP_ENABLE_ANALYTICS", "false") === "true",
    enableDebugMode: getEnvVar("REACT_APP_DEBUG_MODE", "false") === "true",
  },
};

// Development mode checker
export const isDevelopment = () => config.app.environment === "development";

// Production mode checker
export const isProduction = () => config.app.environment === "production";

// Export individual configs for convenience
export const {
  api: apiConfig,
  auth: authConfig,
  app: appConfig,
  features,
} = config;

export default config;
