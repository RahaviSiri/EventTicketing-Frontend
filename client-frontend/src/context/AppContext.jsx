import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const eventServiceURL = 'http://localhost:8080/api/events';
    const userServiceURL = "http://localhost:8080/api/users";
    const [role, setRole] = useState("");
    const [token, setToken] = useState(localStorage.getItem("EventToken") || null);

    const getRole = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${userServiceURL}/getRole`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await res.json();
            if (data.role) setRole(data.role);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getRole();
    }, [token]);

    const changeUserRole = async (roleUser) => {
        if (!token) return;
        try {
            await fetch(`${userServiceURL}/setRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ role: roleUser })
            });
            await getRole();
        } catch (err) {
            console.error(err);
        }
    };

    const value = {
        role,
        setRole,
        setToken,
        token,
        eventServiceURL,
        userServiceURL,
        changeUserRole,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
