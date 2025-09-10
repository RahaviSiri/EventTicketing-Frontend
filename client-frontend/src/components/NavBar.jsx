import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { token, changeUserRole } = useContext(AppContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("EventToken");
    window.location.href = "/";
  };

  const handleButtonClick = async () => {
    if (token) {
      await changeUserRole("ORGANIZER");
      navigate('/organizers/home');
    } else {
      navigate('/login');
    }
  }

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl">
            <span style={{ color: '#8076a3' }}>Event</span>
            <span style={{ color: '#feb300' }}>Ease</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/home"
              className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Events
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>

            <button
              onClick={handleButtonClick}
              className="bg-[#8076a3] text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Create Event
            </button>
            {!token &&
              <Link
                to="/login"
                className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            }
            {token && <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600">
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden md:inline">Logout</span>
            </button>}

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-600 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/home"
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Browse Events
            </Link>
            <Link
              to="/about"
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            <button
              onClick={() => {
                toggleMenu();
                handleButtonClick();
              }}
              className="bg-[#8076a3] text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Create Event
            </button>
            {!token &&
              <Link
                to="/login"
                onClick={toggleMenu}
                className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
            }

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
