import React from 'react';
import NavBar from '../components/NavBar.jsx';
import Events from '../pages/User/Events.jsx';
import { Routes, Route } from 'react-router-dom';
import InputattendeeData from '../pages/User/InputattendeeData.jsx';
import EventDetails from '../pages/User/EventDetails.jsx';
import SeatSelection from '../pages/User/SeatSelection.jsx';
import Payment from '../pages/User/Payment.jsx';
import Home from '../pages/User/Home.jsx';
import Login from '../pages/Login.jsx';
import PaymentSuccess from '../pages/User/PaymentSucces.jsx';
import Contact from '../pages/User/Contact.jsx';

const AttendeeLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:eventId/attendee" element={<InputattendeeData />} />
        <Route path="/events/:eventId/seats" element={<SeatSelection />} />
        <Route path="/events/:eventId/payment" element={<Payment />} />
         <Route path="/events/:eventId/success" element={<PaymentSuccess />} />

                    <Route path="/login" element={<Login />} />

        {/* <Route path="/events/:eventId/confirmation" element={<ConfirmationPage />} /> */}
          </Routes>
        </main>
    </div>
  );
};

export default AttendeeLayout;
