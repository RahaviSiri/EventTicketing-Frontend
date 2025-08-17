import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const featuredEvents = [
    // {
    //   id: 1,
    //   title: "Colombo Tech Summit 2024",
    //   date: "2026-03-15",
    //   location: "Colombo, Sri Lanka",
    //   image:
    //     "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
    //   price: 1500, // Rs.
    //   category: "Technology",
    // },
    {
      id: 2,
      title: "Colombo Music Festival",
      date: "2026-06-20",
      location: "Colombo, Sri Lanka",
      image:
        "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 1200, // Rs.
      category: "Music",
    },
    {
      id: 3,
      title: "Jaffna Music Festival",
      date: "2026-07-05",
      location: "Jaffna, Sri Lanka",
      image:
        "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 1000, // Rs.
      category: "Music",
    },
    {
      id: 4,
      title: "Galle Literary Festival",
      date: "2026-01-20",
      location: "Galle, Sri Lanka",
      image:
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 800, // Rs.
      category: "Literature",
    },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  // Set loading to false immediately after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // optional small delay for spinner
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section (Custom Slider) */}
      <section className="relative h-[500px] overflow-hidden">
        {featuredEvents.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
              <h2 className="text-4xl font-bold mb-4">{event.title}</h2>
              <p className="mb-4">
                {event.location} • {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="mb-6 text-2xl font-bold">
                Rs. {event.price.toLocaleString("en-LK")}
              </p>
              <Link
                to={`/events/${event.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
              >
                <span>View Details</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? "bg-white" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EventEase?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a complete event management solution with
              cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Interactive Seat Maps
              </h3>
              
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
             
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Management</h3>
              
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-gray-600">
              Don't miss these popular upcoming events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      Rs. {event.price.toLocaleString("en-LK")}
                    </span>
                    <Link
                      to={`/events/${event.id}`}
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
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
