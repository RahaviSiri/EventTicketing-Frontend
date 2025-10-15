import React, { createContext, useState, useEffect } from "react";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const userServiceURL = `${BASE_URL}/api/users`;
  const adminServiceURL = `${BASE_URL}/api/admin`;
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("AdminToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("AdminToken");
  };

  return (
    <AppContext.Provider value={{ token, setToken, userServiceURL, logout,adminServiceURL }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
