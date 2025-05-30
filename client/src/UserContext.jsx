import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoading || isFetching || !isAuthenticated || !user?.email) return;
      
      setIsFetching(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/users`,
          { email: user.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const userInfo = res.data.data || res.data;
        console.log("Fetched user data:", userInfo);
        
        if (!userInfo) {
          // If user doesn't exist, create them
          const signupRes = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/authsignup`,
            { 
              username: user.name || user.email.split("@")[0],
              email: user.email,
              role: 'jobSeeker' // Set default role as jobSeeker
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Auth signup response:", signupRes.data);
          setUserData(signupRes.data.data || signupRes.data);
        } else {
          setUserData(userInfo);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, isLoading, user?.email]);

  // Clear userData when user logs out
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setUserData(null);
    }
  }, [isAuthenticated, isLoading]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};