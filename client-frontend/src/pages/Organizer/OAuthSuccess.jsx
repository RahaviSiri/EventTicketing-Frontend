import React from 'react'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from '../../context/AppContext';

const OAuthSuccess = () => {
    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            setToken(token);
            localStorage.setItem("EventToken", token);
            navigate("/organizers"); // or wherever you want
        } else {
            console.error("No token in OAuth redirect");
            navigate("/login"); // fallback
        }
    }, []);

    return <div className="text-center mt-20 text-lg">Logging you in...</div>;
};

export default OAuthSuccess;
