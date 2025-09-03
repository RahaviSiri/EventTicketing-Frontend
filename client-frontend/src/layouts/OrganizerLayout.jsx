import React, { useState } from 'react';
import SideBar from '../components/SideBar.jsx';
import OrganizersNavBar from '../components/OrganizersNavBar.jsx';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Organizer/Dashboard.jsx';
import AddEvent from '../pages/Organizer/AddEvent.jsx';
import OrderDetails from '../pages/Organizer/OrderDetails.jsx';
import Report from '../pages/Organizer/Report.jsx';
import ScanQR from '../pages/Organizer/ScanQR.jsx';
import Login from '../pages/Login.jsx';
import OAuthSuccess from '../pages/Organizer/OAuthSuccess.jsx';
import EventsList from '../pages/Organizer/EventsList.jsx';
import EventDetailsPage from '../pages/Organizer/EventDetailsPage.jsx';
import SeatDesignLayout from '../pages/Organizer/SeatDesignLayout.jsx';
import DiscountCreation from '../pages/Organizer/DiscountCreation.jsx';
import DiscountList from '../pages/Organizer/DiscountList.jsx';

const OrganizerLayout = () => {

  return (
    <div className="flex flex-col h-screen">
      <OrganizersNavBar/>

      <div className="flex flex-1 overflow-hidden">
        <SideBar/>

        <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/organizers/home" element={<Dashboard />} />
            <Route path="/organizers/viewEvent" element={<EventsList />} />
            <Route path="/organizers/orderDetails" element={<OrderDetails />} />
            <Route path="/organizers/report" element={<Report />} />
            <Route path="/organizers/scanQR" element={<ScanQR />} />
            <Route path="/organizers/addEvent" element={<AddEvent />} />
            <Route path="/organizers/updateEvent/:id" element={<AddEvent />} />
            <Route path="/organizers/designLayout" element={< SeatDesignLayout/>} />
            <Route path="/organizers/eventDetails" element={<EventDetailsPage />} />
            <Route path="/organizers/createDiscount" element={<DiscountCreation />} />
            <Route path="/organizers/discountLists" element={<DiscountList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
