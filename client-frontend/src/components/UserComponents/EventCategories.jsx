import React from "react";
import {
  Briefcase,
  Users,
  BookOpen,
  Wrench,
  Store,
  Music,
  CookingPot,
} from "lucide-react";
import { motion } from "framer-motion";
import colors from "../../constants/colors";

const categories = [
  { id: 1, name: "Conference", icon: Briefcase, color: "blue" },
  { id: 2, name: "Meetup", icon: Users, color: "green" },
  { id: 3, name: "Seminar", icon: BookOpen, color: "purple" },
  { id: 4, name: "Workshop", icon: Wrench, color: "orange" },
  { id: 5, name: "Expo", icon: Store, color: "red" },
  { id: 6, name: "Festival", icon: CookingPot, color: "pink" },
  { id: 7, name: "Concert", icon: Music, color: "indigo" },
];

const EventCategories = () => {
  return (
    <section className="py-5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Explore{" "}
          <span style={{ color: colors.secondaryYellow }}>
            Event Categories
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Discover different types of events tailored to your needs, from
          professional conferences to vibrant festivals.
        </p>

        {/* Scrollable Categories */}
        <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2 pb-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ backgroundColor: colors.secondary }}
              className="min-w-[160px] snap-center p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition cursor-pointer"
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center mx-auto mb-3 rounded-full w-12 h-12 bg-${cat.color}-100`}
              >
                <cat.icon className={`h-6 w-6 text-${cat.color}-600`} />
              </div>

              {/* Label */}
              <h3
                style={{ color: colors.primary }}
                className="text-lg font-semibold"
              >
                {cat.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategories;
