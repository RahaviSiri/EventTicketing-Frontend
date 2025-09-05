import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import colors from "../../constants/colors";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "Host Exceptional Events",
    subtitle: "Transform conferences into seamless, professional experiences.",
    image: "/Event_1.jpg",
  },
  {
    id: 2,
    title: "Build Thriving Communities",
    subtitle: "Create meetups that connect people and spark ideas.",
    image: "/Event_2.jpg",
  },
  {
    id: 3,
    title: "Celebrate Unforgettable Moments",
    subtitle: "Turn every festival and gathering into lifelong memories.",
    image: "/Event_3.jpg",
  },
  {
    id: 4,
    title: "Network & Connect with Ease",
    subtitle: "Attend meaningful events that grow your professional circle.",
    image: "/Event_4.jpg",
  },
  {
    id: 5,
    title: "Curate Unforgettable Experiences",
    subtitle: "Discover music, culture, and experiences that stay with you.",
    image: "/Event_5.jpg",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full sm:h-[60vh] md:h-[50vh] lg:h-[80vh] flex flex-col md:flex-row overflow-hidden bg-white">
      {/* LEFT TEXT SECTION */}
      <div className="flex-1 flex items-center justify-center md:ml-13 lg:ml-13">
        <div className="max-w-lg text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[current].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h1 style={{color : colors.secondaryYellow}} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {slides[current].title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                {slides[current].subtitle}
              </p>
              <motion.button
                onClick={() => navigate('/events')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: colors.primary }}
                className="px-6 py-3 text-white font-semibold rounded-full shadow-md flex items-center gap-2 mx-auto md:mx-0"
              >
                Explore Events <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT IMAGE SECTION (fit instead of crop) */}
      <div className="flex-2 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[current].id}
            src={slides[current].image}
            alt={slides[current].title}
            className="inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
      </div>

      {/* DOT NAVIGATION */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              current === idx ? "bg-gray-900" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
