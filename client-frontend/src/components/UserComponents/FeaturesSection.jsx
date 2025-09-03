import React from 'react'
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import colors from '../../constants/colors';

const FeaturesSection = () => {
  return (
    <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span style={{color : colors.primary}}>EventEase?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Complete event management solution with interactive seat maps,
            smart reminders, and effortless management.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Interactive Seat Maps", color: "blue" },
              { icon: Calendar, title: "Smart Reminders", color: "green" },
              { icon: Users, title: "Easy Management", color: "purple" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center mx-auto mb-2 rounded-full bg-${feature.color}-100`}
                >
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default FeaturesSection