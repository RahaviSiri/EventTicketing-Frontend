import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const eventServiceURL = 'http://localhost:8080/api/events';
    const userServiceURL = "http://localhost:8080/api/users";
    const seatingServiceURL = "http://localhost:8080/api/seating-charts";
    const discountServiceURL = "http://localhost:8080/api/discounts";
    const paymentServiceURL = "http://localhost:8080/api/payments";
    const ticketServiceURL = "http://localhost:8080/api/tickets";
    const orderServiceURL = "http://localhost:8080/api/orders";
    const notificationServiceURL = "http://localhost:8080/api/notifications";

    const [role, setRole] = useState(null);
    const [userID, setUserID] = useState();
    const savedToken = localStorage.getItem("EventToken");
    const [token, setToken] = useState(savedToken && savedToken !== "null" ? savedToken : null);


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
        if (!token) {
            console.log("No token found — skipping protected API calls.");
            return;
        }

        (async () => {
            try {
                await getRole();
                await getUserID();
            } catch (err) {
                console.error("Error while fetching user info:", err);
                // optional: clear invalid token
                localStorage.removeItem("EventToken");
                setToken(null);
            }
        })();
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
