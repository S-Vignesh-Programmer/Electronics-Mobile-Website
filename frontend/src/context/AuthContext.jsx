// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { apiConfig } from "../config.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Initialize token from localStorage on app start
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(apiConfig.tokenKey);
      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.error("Error loading token from localStorage:", error);
    } finally {
      setLoading(false); // Always set loading to false
    }
  }, []);

  const login = (newToken) => {
    try {
      localStorage.setItem(apiConfig.tokenKey, newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(apiConfig.tokenKey);
      // Also clear cart if needed
      localStorage.removeItem("cart");
      setToken(null);
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
    }
  };

  const value = {
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token, // Add this for easier checking
  };

  // Don't render children until we've checked for existing token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
