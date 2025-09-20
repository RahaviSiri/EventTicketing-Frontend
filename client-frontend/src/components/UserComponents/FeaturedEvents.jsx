import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { HeaderContext } from "../../context/HeaderContext";
import colors from "../../constants/colors";
import { Link } from "react-router-dom";

const FeaturedEvents = ({ limit = 3 }) => {
  const { api } = useContext(HeaderContext);          
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // ✅ fetch first `limit` events from paged endpoint
        const data = await api.getAllEvents(0, limit);
        const mapped = data.content.map((ev) => ({
          id: ev.id,
          title: ev.name,
          date: ev.startDate,
          location: ev.venue?.name || "TBD",
          category: ev.category,
          image: ev.imageUrl,
          availableSeats: ev.availableSeats,
        }));
        setFeaturedEvents(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [api, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 bg-gray-50">
        <div className="animate-spin h-12 w-12 border-t-4 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16 bg-gray-50 text-red-600">
        {error}
      </div>
    );
  }

  if (!featuredEvents.length) {
    return (
      <div className="flex justify-center items-center py-16 bg-gray-50 text-gray-600">
        No events available at the moment.
      </div>
    );
  }

  return (
    <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Featured <span style={{ color: colors.accent }}>Events</span>
          </h2>
          <p className="text-gray-600 mt-2">
            A quick look at some upcoming highlights
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={event.image || "/placeholder.png"}
                  alt={event.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full"
                  style={{ backgroundColor: colors.accent }}
                >
                  {event.category || "Uncategorized"}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {event.title}
                </h3>

                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "Date TBD"}
                </div>

                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location || "Location TBD"}
                </div>

                {event.availableSeats !== undefined && (
                  <p className="text-sm text-gray-500 mb-4">
                    {event.availableSeats} seats left
                  </p>
                )}

                <Link
                  to={`/events/${event.id}`}
                  className="inline-block w-full text-center text-white font-medium px-4 py-2 rounded-xl transition-colors"
                  style={{ backgroundColor: colors.primary }}
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
