import React from "react";
import { color, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import colors from "../../constants/colors";

const CTABanner = ({
  title = "Never Miss an Event!",
  subtitle = "Subscribe to get the latest updates.",
  buttonText = "Subscribe",
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-between gap-6">
      {/* Text */}
        <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>
        <p className="text-lg opacity-90">{subtitle}</p>

      {/* Button */}
      <button
        onClick={onClick}
        className="group inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full shadow-md transition duration-200 text-white"
        style={{
          backgroundColor: colors.secondaryYellow,
        }}
      >
        {buttonText}
        <ArrowRight
          size={18}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </button>
    </div>
  );
};

export default CTABanner;
