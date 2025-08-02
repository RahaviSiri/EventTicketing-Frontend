import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import SearchBar from "./SearchBar";


const navItems = [
  { path: "/", icon: <HomeIcon className="h-5 w-5" />, label: "Home" },
  {
    path: "/events",
    icon: <CalendarIcon className="h-5 w-5" />,
    label: "Events",
  },
  {
    path: "/about",
    icon: <DocumentTextIcon className="h-5 w-5" />,
    label: "About",
  },
  {
    path: "/contact",
    icon: <DocumentTextIcon className="h-5 w-5" />,
    label: "Contact",
  },
];

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="w-screen bg-white px-4 py-3 flex justify-between items-center shadow z-40 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-xl">
        <span className="text-[#2d545e]">Event</span>
        <span className="text-[#c89666]">Ease</span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex gap-6 items-center">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-1 text-sm font-medium ${
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* SearchBar - Desktop only */}
      <div>
        <SearchBar onSearch={(query) => console.log("Search for:", query)} placeHolder="Search events" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Login / Register (Desktop only) */}
        <div className="hidden lg:flex gap-2 items-center">
          <NavLink
            to="/login"
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-600"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            Register
          </NavLink>
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hover:bg-gray-100 p-2 rounded-md lg:hidden"
        >
          <Squares2X2Icon className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-20 left-0 w-screen bg-white shadow-xl rounded-lg p-4 gap-4 z-50 lg:hidden"
        >
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm p-2 rounded-md ${
                  isActive
                    ? "bg-gray-200 text-blue-600"
                    : "hover:bg-gray-100 text-gray-800"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <div className="mt-3 border-t pt-2 flex flex-col gap-2">
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-blue-600 text-sm"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="text-blue-600 text-sm"
            >
              Register
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
