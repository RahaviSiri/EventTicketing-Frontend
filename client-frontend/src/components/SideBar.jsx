import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CalendarIcon, DocumentTextIcon, QrCodeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', icon: <HomeIcon className="h-6 w-6" />, label: 'Dashboard' },
  { path: '/addEvent', icon: <PlusCircleIcon className="h-6 w-6" />, label: 'Add Event' },
  { path: '/orderDetails', icon: <CalendarIcon className="h-6 w-6" />, label: 'Orders' },
  { path: '/report', icon: <DocumentTextIcon className="h-6 w-6" />, label: 'Report Generate' },
  { path: '/scanQR', icon: <QrCodeIcon className="h-6 w-6" />, label: 'Scan QR' },
];

const SideBar = () => {
  return (
    <div className={`
          fixed z-40 lg:relative transition-transform duration-300 -translate-x-full
          lg:translate-x-0 
          bg-[#2d545e] text-white w-64 lg:w-20 h-full p-4 flex flex-col
        `}
        // lg:translate-x-0 means on large screens and above, always visible (no translate).
    >
      {/* Nav Links */}
      <nav className="flex flex-col gap-4 mt-4">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                 ${isActive ? 'bg-[#c89666]' : 'hover:bg-[#e1b382]'}`
            }
          >
            {item.icon}
            {/* Show label only on hover (lg), always show on mobile */}
            <span className="text-sm font-medium lg:hidden">{item.label}</span>
            <span
              className="
                  hidden lg:group-hover:inline-block lg:absolute bg-black/50 text-white px-2 py-1 rounded-md left-22 whitespace-nowrap shadow-md z-50
                "
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
