"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

// Define the types for the context
interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string) => void;
  setRole: (role: string) => void;
  logout: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // This will only run on the client-side after the component has mounted
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedRole) {
      setRole(storedRole);
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

  // Method to log out (clear token and role)
  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

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
