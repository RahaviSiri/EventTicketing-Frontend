import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Events from "../pages/User/Events.jsx";
import InputattendeeData from "../pages/User/InputattendeeData.jsx";
import EventDetails from "../pages/User/EventDetails.jsx";
import SeatSelection from "../pages/User/SeatSelection.jsx";
import Payment from "../pages/User/Payment.jsx";
import Home from "../pages/User/Home.jsx";
import Login from "../pages/Login.jsx";
import PaymentSuccess from "../pages/User/PaymentSucces.jsx";
import Contact from "../pages/User/Contact.jsx";
import About from "../pages/User/About.jsx";
import Slider_1 from "../components/UserComponents/Slider_1.jsx";
import Slider_2 from "../components/UserComponents/Slider_2.jsx";

const AttendeeLayout = () => {
  const location = useLocation();

  // Routes where NavBar should be hidden
  const hideNavBarRoutes = ["/", "/slider_2", "/login"];

  // Routes where padding should be removed
  const noPaddingRoutes = ["/", "/slider_2", "/login"];

  const shouldShowNavBar = !hideNavBarRoutes.includes(location.pathname);
  const shouldHavePadding = !noPaddingRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen">
      {shouldShowNavBar && <NavBar />}
      <main className={`flex-1 overflow-y-auto ${shouldHavePadding ? "p-4" : ""}`}>
        <Routes>
          <Route path="/" element={<Slider_1 />} />
          <Route path="/slider_2" element={<Slider_2 />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/events/:eventId/attendee" element={<InputattendeeData />} />
          <Route path="/events/:eventId/seats" element={<SeatSelection />} />
          <Route path="/events/:eventId/payment" element={<Payment />} />
          <Route path="/events/:eventId/success" element={<PaymentSuccess />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};


export default AttendeeLayout;
