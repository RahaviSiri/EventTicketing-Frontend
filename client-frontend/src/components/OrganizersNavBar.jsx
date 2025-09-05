import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, CalendarIcon, DocumentTextIcon, QrCodeIcon, PlusCircleIcon, Squares2X2Icon,
ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import colors from "../constants/colors";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const navItems = [
    { path: "/organizers/home", icon: <HomeIcon className="h-6 w-6" />, label: "Dashboard" },
    {
        path: "/organizers/viewEvent",
        icon: <PlusCircleIcon className="h-6 w-6" />,
        label: "View Event",
    },
    {
        path: "/organizers/discountLists",
        icon: <DocumentTextIcon className="h-6 w-6" />,
        label: "Discounts List",
    },
    {
        path: "/organizers/orderDetails",
        icon: <CalendarIcon className="h-6 w-6" />,
        label: "Orders",
    },
    {
        path: "/organizers/scanQR",
        icon: <QrCodeIcon className="h-6 w-6" />,
        label: "Scan QR",
    },
];

const handleLogout = () => {
    localStorage.removeItem("EventToken");
    window.location.href = "/login"; 
};

const OrganizerNavBar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const { changeUserRole } = useContext(AppContext);
    const navigate = useNavigate();

    const handleChangeRole = async () => {
        await changeUserRole("ATTENDEE");
        navigate("/");
    }
    
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                // e.target is the thing the user clicked on.
                // .contains(e.target) checks if that clicked thing is inside the dropdown.
                // The ! means: we're checking if it’s not inside.
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler); // Clean Up
    }, []);
    // Runs only once — when the component loads.

    return (
        <header className="w-screen bg-white px-4 py-3 flex justify-between items-center shadow z-40 relative">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl">
                <span style={{color: colors.primary}}>Event</span>
                <span style={{color: colors.accent}}>Ease</span>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
                {/* Dropdown trigger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="hover:bg-gray-100 p-2 rounded-md lg:hidden"
                >
                    <Squares2X2Icon className="h-6 w-6 text-gray-700" />
                </button>

                {/* Dropdown trigger */}
                <button
                    onClick={handleChangeRole}
                    style={{ backgroundColor: colors.primary }}
                    className="p-1 lg:p-2 text-sm lg:text-md rounded-md text-white"
                >
                    Become User
                </button>

                {/* Profile Initial */}
                <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold">
                    AL
                </div>

                {/* Logout */}
                <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Logout</span>
                </button>
            </div>

            {/* Dropdown Menu */}
            {menuOpen && (
                <div
                    ref={menuRef}
                    // tells React: “When you render this <div>, store a reference to it in menuRef.current.”
                    className="absolute top-20 left-0 w-screen bg-white shadow-xl rounded-lg p-4 gap-4 z-50"
                >
                    {navItems.map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `group flex flex-col items-center text-center text-sm p-2 rounded-md transition ${isActive
                                    ? "bg-gray-200 text-red-600"
                                    : "hover:bg-gray-100 text-gray-800"
                                }`
                            }
                        >
                            {item.icon}
                            {/* Hover label on large screens, always show on mobile */}
                            <span className="mt-1 hidden lg:block opacity-0 group-hover:opacity-100 transition duration-200">
                                {item.label}
                            </span>
                            <span className="mt-1 lg:hidden block">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            )}
        </header>
    );
};

export default OrganizerNavBar;
