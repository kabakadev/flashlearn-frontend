import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();
const API_URL = "http://localhost:5000";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const TOKEN_KEY = "authToken";

  const fetchUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signup = async (email, username, password) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup failed:", data.error);
        return false;
      }

      console.log("Signup successful:", data);

      // Wait for login to complete
      return await login(email, password);
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    console.log("Login process started for:", email);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.error);
        return false;
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      console.log("Login successful, token stored.");
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Login error:", error);
      console.log("Login process failed for:", email);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, signup, login, logout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
