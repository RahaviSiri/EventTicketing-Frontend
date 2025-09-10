import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import colors from "../../constants/colors";

const Slider_2 = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center relative overflow-hidden">
      
      {/* Bottom Background Image */}
      <div
        className="absolute bottom-0 left-0 w-full h-75 sm:h-64 md:h-80 lg:h-90 xl:h-55 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/TopBackround.jpg')" }}
      ></div>

      {/* Content */}
      <motion.div className="relative z-10 px-4 lg:mb-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl font-extrabold mb-6"
        >
          Plan & Manage <span style={{ color: colors.accent }}>Effortlessly</span>
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-secondary max-w-lg mx-auto mb-12"
        >
          Create events, manage seating, and send reminders with just a few clicks.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          style={{ backgroundColor: colors.primary }}
          className="px-8 py-4 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all text-lg"
        >
          Join From Here →
        </motion.button>
      </motion.div>

      {/* Decorative Background Circles */}
      <div
        className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.primary }}
      ></div>
      <div
        className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: colors.accent }}
      ></div>
    </div>
  );
};

export default Slider_2;
