import React, { createContext, useState } from "react";

// Create the context
export const AppContext = createContext();

// Create the context Provider
export const AppContextProvider = ({children}) => {

    const eventServiceURL = 'http://localhost:8080/api/events';
    const [role,setRole] = useState("ATTENDEE");
    const [token, setToken] = useState(localStorage.getItem("EventToken") || null);


    const value = {
        role,
        setRole,
        setToken,
        token,
        eventServiceURL

    }

    return ( 
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

