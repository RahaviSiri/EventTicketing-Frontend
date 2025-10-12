import React, { createContext, useState, useEffect } from "react";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const userServiceURL = "http://localhost:8080/api/users";
  const adminServiceURL = "http://localhost:8080/api/admin";
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
