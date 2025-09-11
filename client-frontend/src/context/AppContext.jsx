import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const eventServiceURL = 'http://localhost:8080/api/events';
    const userServiceURL = "http://localhost:8080/api/users";
    const seatingServiceURL = "http://localhost:8080/api/seating-charts";
    const discountServiceURL = "http://localhost:8080/api/discounts";
    const paymentServiceURL = "http://localhost:8080/api/payments";
    const ticketServiceURL = "http://localhost:8080/api/tickets";
    const orderserviceURL = "http://localhost:8080/api/orders";


    const [role, setRole] = useState(null);
    const [userID, setUserID] = useState();
    const [token, setToken] = useState(localStorage.getItem("EventToken") || null);

    const getRole = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${userServiceURL}/getRole`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
        getUserID();
        console.log("Role:", role);
        console.log("UserID:", userID);
    }, [token]);

    const changeUserRole = async (roleUser) => {
        if (!token) return;
        try {
            await fetch(`${userServiceURL}/setRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: roleUser })
            });
            await getRole();
        } catch (err) {
            console.error(err);
        }
    };

    const getUserID = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${userServiceURL}/getUserID`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (data.userID) setUserID(data.userID);
        } catch (err) {
            console.error(err);
        }
    }

    const value = {
        role,
        setRole,
        setToken,
        token,
        eventServiceURL,
        userServiceURL,
        changeUserRole,
        userID,
        seatingServiceURL,
        discountServiceURL,
        paymentServiceURL,
        ticketServiceURL
        ,orderserviceURL

        
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
