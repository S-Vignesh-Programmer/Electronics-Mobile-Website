import { createContext, useContext, useState } from "react";
import { apiConfig } from "../config.js"; // FIXED: Import from correct config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // FIXED: Use the correct token key from config
  const [token, setToken] = useState(localStorage.getItem(apiConfig.tokenKey));

  const login = (token) => {
    localStorage.setItem(apiConfig.tokenKey, token); // FIXED: Use correct token key
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem(apiConfig.tokenKey); // FIXED: Use correct token key
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
