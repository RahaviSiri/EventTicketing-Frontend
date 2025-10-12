import React, { createContext, useState, useEffect } from "react";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const userServiceURL = "http://localhost:8080/api/users";
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
    <AppContext.Provider value={{ token, setToken, userServiceURL, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
