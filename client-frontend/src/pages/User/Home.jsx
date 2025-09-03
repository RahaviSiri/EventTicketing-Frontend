import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);

  const { token } = useContext(AppContext);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:8080/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
        const data = await res.json();

        const mappedData = data.map((ev) => ({
          id: ev.id,
          title: ev.name,
          date: ev.startDate,
          location: ev.venue?.name || "TBD",
          category: ev.category,
          image: ev.imageUrl,
          price: ev.price,
          rating: ev.rating,
          availableSeats: ev.availableSeats,
        }));

        setFeaturedEvents(mappedData);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  // Auto-slide
  useEffect(() => {
    if (featuredEvents.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  if (!featuredEvents.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">No events available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <section className="relative h-[550px] overflow-hidden">
        {featuredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === current ? 1 : 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0`}
          >
            <img
              src={event.image || "/placeholder.png"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-extrabold mb-4 drop-shadow-lg"
              >
                {event.title}
              </motion.h2>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-lg font-medium"
              >
                {event.location} •{" "}
                {event.date ? new Date(event.date).toLocaleDateString() : "Date TBD"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to={`/events/${event.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 shadow-lg transition"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {featuredEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? "bg-white scale-110" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">EventEase</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
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
                  className={`w-16 h-16 flex items-center justify-center mx-auto mb-6 rounded-full bg-${feature.color}-100`}
                >
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Featured Events</h2>
            <p className="text-gray-600">Don’t miss these popular upcoming events</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-1"
              >
                <img
                  src={event.image || "/placeholder.png"}
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {event.category || "Uncategorized"}
                  </span>
                  <h3 className="text-xl font-semibold mt-3 text-gray-900 line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date ? new Date(event.date).toLocaleDateString() : "Date TBD"}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location || "Location TBD"}
                  </div>
                  {event.availableSeats !== undefined && (
                    <span className="text-sm text-gray-500 mt-2 block">
                      {event.availableSeats} seats left
                    </span>
                  )}
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full mt-5 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg transition block text-center font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition shadow-md"
            >
              <span>View All Events</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Home;
