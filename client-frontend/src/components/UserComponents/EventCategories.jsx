import React from "react";
import { Briefcase, Users, BookOpen, Wrench, Store, Music } from "lucide-react";
import { motion } from "framer-motion";
import colors from "../../constants/colors";

const categories = [
  { id: 1, name: "Conference", icon: Briefcase, color: "blue" },
  { id: 2, name: "Meetup", icon: Users, color: "green" },
  { id: 3, name: "Seminar", icon: BookOpen, color: "purple" },
  { id: 4, name: "Workshop", icon: Wrench, color: "orange" },
  { id: 5, name: "Expo", icon: Store, color: "red" },
  { id: 6, name: "Festival", icon: Music, color: "pink" },
];

const EventCategories = () => {
  return (
    <section className="py-10 ">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Explore <span style={{ color: colors.secondaryYellow }}>Event Categories</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Discover different types of events tailored to your needs, from
          professional conferences to vibrant festivals.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              style={{backgroundColor : colors.secondary}}
              whileHover={{ scale: 1.08 }}
              className="p-6 rounded-2xl border border-gray-100 shadow-sm transition cursor-pointer"
            >
              <div
                className={`flex items-center justify-center mx-auto mb-1 rounded-full`}
              >
                <cat.icon className={`h-6 w-6 text-${cat.color}-600`} />
              </div>
              <h3 style={{color : colors.primary}} className="text-lg font-semibold">
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
