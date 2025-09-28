import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import colors from "../../constants/colors";

const Slider_1 = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Logo / App Name */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl sm:text-5xl md:text-5xl font-extrabold mb-6 leading-tight break-words"
      >
        <span style={{ color: colors.primary }}>Event</span>{" "}
        <span style={{ color: colors.accent }}>Ease</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-12 px-2"
      >
        The all-in-one{" "}
        <span className="font-semibold">Event Ticketing</span> & Management
        System with Seating Arrangements and Automated Reminders.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/slider_2")}
        style={{ backgroundColor: colors.accent }}
        className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all text-base sm:text-lg"
      >
        Get Started →
      </motion.button>

      {/* Decorative Background Circles */}
      <div
        className="absolute top-[-80px] left-[-80px] w-40 sm:w-60 md:w-72 h-40 sm:h-60 md:h-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.primary }}
      ></div>
      <div
        className="absolute bottom-[-100px] right-[-100px] w-52 sm:w-72 md:w-80 h-52 sm:h-72 md:h-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.accent }}
      ></div>
    </div>
  );
};

export default Slider_1;
