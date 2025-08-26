import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredUser,
  getStoredToken,
  isAuthenticated,
  logout,
} from "@/lib/auth";
import { getCurrentUser } from "@/lib/api";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (isAuthenticated()) {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);

          // Verify token is still valid by fetching current user
          try {
            const response = await getCurrentUser();
            if (response.success) {
              setUser(response.data.user);
              // Update stored user data
              localStorage.setItem("user", JSON.stringify(response.data.user));
            }
          } catch (error) {
            console.error("Token validation failed:", error);
            logout();
          }
        }
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout: logoutUser,
    updateUser,
    loading,
    isAuthenticated: !!user,
    hasRole: (role) => {
      if (!user) return false;
      const roleHierarchy = { CONSUMER: 1, CREATOR: 2, ADMIN: 3 };
      return (roleHierarchy[user.role] || 0) >= (roleHierarchy[role] || 0);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
