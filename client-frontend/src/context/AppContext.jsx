import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const eventServiceURL = `${BASE_URL}/api/events`;
    const userServiceURL = `${BASE_URL}/api/users`;
    const seatingServiceURL = `${BASE_URL}/api/seating-charts`;
    const discountServiceURL = `${BASE_URL}/api/discounts`;
    const paymentServiceURL = `${BASE_URL}/api/payments`;
    const ticketServiceURL = `${BASE_URL}/api/tickets`;
    const orderServiceURL = `${BASE_URL}/api/orders`;
    const notificationServiceURL = `${BASE_URL}/api/notifications`;


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
        ticketServiceURL,
        orderServiceURL,
        notificationServiceURL,
        
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
