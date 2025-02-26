import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {}
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
          const token = localStorage.getItem("token");
          if (!token) {
            setLoading(false);
            return;
          }
    
          try {
            const response = await fetch("http://127.0.0.1:5000/auth/user", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (!response.ok) {
              throw new Error("Failed to fetch user");
            }
    
            const data = await response.json();
            setUser(data); 
            setIsAuthenticated(true); 
          } catch (error) {
            console.error("Error fetching user:", error);
            setIsAuthenticated(false); 
          } finally {
            setLoading(false); 
          }
        };
    
        fetchUser();
      }, []);