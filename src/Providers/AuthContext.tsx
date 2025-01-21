"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the types for the context
interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // This will only run on the client-side after the component has mounted
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedRole) {
      setRole(storedRole);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse user data stored as JSON
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Method to set the token and store it in localStorage
  const handleSetToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
  };

  // Method to set the role and store it in localStorage
  const handleSetRole = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  // Method to set the user and store it in localStorage
  const handleSetUser = (newUser: UserType | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Method to log out (clear token, role, and user data)
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");

    // Remove cookies using js-cookie
    Cookies.remove("authToken");
    Cookies.remove("userRole");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        setToken: handleSetToken,
        setRole: handleSetRole,
        setUser: handleSetUser,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
