import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import colors from "../constants/colors";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  CalendarIcon,
  InformationCircleIcon,
  PhoneIcon,
  TicketIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { token, changeUserRole } = useContext(AppContext);

  const toggleMenu = () => setIsOpen(!isOpen);

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
  };

  const menuItems = [
    { name: 'Home', to: '/home', icon: HomeIcon },
    { name: 'Browse Events', to: '/events', icon: CalendarIcon },
    { name: 'About', to: '/about', icon: InformationCircleIcon },
    { name: 'Contact', to: '/contact', icon: PhoneIcon },
    { name: 'My Bookings', to: '/mybookings', icon: TicketIcon },
  ];

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
          <div className="hidden md:flex items-center space-x-4 mt-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="flex flex-col items-center text-gray-800 hover:text-gray-600 px-3 rounded-md text-sm font-medium"
              >
                <item.icon className="h-5 w-5" style={{ color: colors.primary }} />
                <span>{item.name}</span>
              </Link>
            ))}

            <button
              onClick={handleButtonClick}
              className="flex items-center gap-1 bg-[#8076a3] text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Create Event</span>
            </button>

            {!token &&
              <Link
                to="/login"
                className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            }

            {token &&
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            }
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-600 focus:outline-none"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden  shadow">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={toggleMenu}
                className="flex items-center gap-1 text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-base font-medium"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {!token &&
              <Link
                to="/login"
                className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            }

            {token &&
              <button
                onClick={handleLogout}
                className="px-3 py-2 flex items-center gap-1 text-sm text-gray-700 hover:text-red-600"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="inline">Logout</span>
              </button>
            }

            <button
              onClick={() => {
                toggleMenu();
                handleButtonClick();
              }}
              className="ml-3 flex items-center gap-1 bg-[#8076a3] text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
