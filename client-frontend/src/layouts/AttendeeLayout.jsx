import React, { useEffect, useState } from "react";
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
import Footer from "../components/UserComponents/Footer.jsx";
import MyBookings from "../pages/User/MyBookings.jsx";
import colors from "../constants/colors.js";
import EmailVerify from "../components/EmailVerify.jsx";
import ChangePassword from "../components/ChangePassword.jsx";

const AttendeeLayout = () => {
  const location = useLocation();

  // Routes where NavBar should be hidden
  const hideNavBarRoutes = ["/", "/slider_2", "/login", "/verify-email", "/change-password"];

  // Routes where padding should be removed
  const noPaddingRoutes = ["/", "/slider_2", "/login", "/contact"];

  const shouldShowNavBar = !hideNavBarRoutes.includes(location.pathname);
  const shouldHavePadding = !noPaddingRoutes.includes(location.pathname);

  // State to show/hide scroll button
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col ">
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
          <Route path="/mybookings" element={<MyBookings />} />
          <Route  path="/verify-email" element={<EmailVerify/>}/>
          <Route  path="/change-password" element={<ChangePassword/>}/>
        </Routes>
      </main>
      <Footer/>
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          style={{backgroundColor: colors.secondary}}
          className="w-10 h-10 fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition text-center "
        >
          ↑
        </button>
      )}
    </div>
  );
};


export default AttendeeLayout;
