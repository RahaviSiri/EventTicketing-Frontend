import React, { useState } from 'react';
import SideBar from '../components/SideBar.jsx';
import OrganizersNavBar from '../components/OrganizersNavBar.jsx';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Organizer/Dashboard.jsx';
import AddEvent from '../pages/Organizer/AddEvent.jsx';
import OrderDetails from '../pages/Organizer/OrderDetails.jsx';
import Report from '../pages/Organizer/Report.jsx';
import ScanQR from '../pages/Organizer/ScanQR.jsx';

const OrganizerLayout = () => {

  return (
    <div className="flex flex-col h-screen">
      <OrganizersNavBar/>

      <div className="flex flex-1 overflow-hidden">
        <SideBar/>

        <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/addEvent" element={<AddEvent />} />
            <Route path="/orderDetails" element={<OrderDetails />} />
            <Route path="/report" element={<Report />} />
            <Route path="/scanQR" element={<ScanQR />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
