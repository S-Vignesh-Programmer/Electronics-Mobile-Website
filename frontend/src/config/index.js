// config/index.js

const getEnvVar = (key, defaultValue = "") => {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return import.meta.env[key] ?? defaultValue;
    }

    if (typeof process !== "undefined" && process.env) {
      return process.env[key] ?? defaultValue;
    }

    return defaultValue;
  } catch (error) {
    console.warn(`Failed to get environment variable ${key}:`, error);
    return defaultValue;
  }
};

export const config = {
  api: {
    baseUrl: getEnvVar("VITE_API_BASE_URL"),
    timeout: parseInt(getEnvVar("VITE_API_TIMEOUT", "10000")),
    tokenKey: getEnvVar("VITE_TOKEN_KEY", "token"),
  },

  auth: {
    timeout: parseInt(getEnvVar("VITE_AUTH_TIMEOUT", "15000")),
    tokenExpiryBuffer: 5 * 60 * 1000,
    refreshTokenKey: getEnvVar("VITE_REFRESH_TOKEN_KEY", "refreshToken"),
  },

  app: {
    name: getEnvVar("VITE_APP_NAME", "My App"),
    version: getEnvVar("VITE_APP_VERSION", "1.0.0"),
    environment: getEnvVar("VITE_ENVIRONMENT", "development"),
  },

  features: {
    enableLogging: getEnvVar("VITE_ENABLE_LOGGING", "true") === "true",
    enableAnalytics: getEnvVar("VITE_ENABLE_ANALYTICS", "false") === "true",
    enableDebugMode: getEnvVar("VITE_DEBUG_MODE", "false") === "true",
  },
};
