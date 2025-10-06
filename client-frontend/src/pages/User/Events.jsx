import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Search, Filter, Star } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import colors from "../../constants/colors";
import { HeaderContext } from "../../context/HeaderContext";
import { EventCategoriesEnum } from "../../constants/EventCategories";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useContext(HeaderContext);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const { token } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // optional, for smooth scroll
    });
  }, [page, size, selectedCategory, searchTerm, events]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await api.getAllEvents(page, size);
        console.log(data);
        setTotalPages(data.totalPages);
        const mappedData = data.content.map((ev) => {
          const eventDate = new Date(
            ev.startDate + "T" + (ev.startTime || "00:00")
          );
          const now = new Date();
          return {
            id: ev.id,
            title: ev.name,
            date: ev.startDate,
            location: ev.venue?.name || "TBD",
            category: ev.category,
            image: ev.imageUrl,
            price: ev.price,
            rating: ev.rating,
            availableSeats: ev.availableSeats,
            expired: eventDate < now, // true if event date/time has passed
          };
        });

        setEvents(mappedData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [api, page, size, token]);

  const filteredEvents = events.filter((event) => {
    const title = event.title || "";
    const location = event.location || "";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.values(EventCategoriesEnum);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-32 w-32 border-4"
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            borderBottomColor: colors.primary,
          }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            All Events
          </h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by name or location..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No events found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                data-testid="event-card"
                key={event.id}
                className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
                style={{ backgroundColor: colors.secondary }}
              >
                {event.expired && (
                  <span
                    className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded"
                    style={{ backgroundColor: "red" }}
                  >
                    Expired
                  </span>
                )}
                <img
                  src={event.image || "/placeholder.png"}
                  alt={event.title || "Event"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-white text-xs font-semibold px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: colors.accent }}
                    >
                      {event.category || "Uncategorized"}
                    </span>
                    {event.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {event.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {event.title || "Untitled Event"}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "Date TBD"}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location || "Location TBD"}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    {event.availableSeats !== undefined && (
                      <span className="text-sm text-gray-500">
                        {event.availableSeats} seats left
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full text-white px-4 py-2 rounded-md transition-colors text-center block"
                    style={{ backgroundColor: colors.primary }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center mt-10 gap-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          style={{ backgroundColor: colors.primary }}
          className="px-4 py-2 rounded text-white disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          style={{ backgroundColor: colors.primary }}
          className="px-4 py-2 rounded text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Events;
