import React, { createContext, useState } from "react";

// Create the context
export const AppContext = createContext();

// Create the context Provider
export const AppContextProvider = ({children}) => {

    const [role,setRole] = useState("ATTENDEE");
    // const [role,setRole] = useState("ORGANIZER");


    const value = {
        role,
        setRole,

    }

    return ( 
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

