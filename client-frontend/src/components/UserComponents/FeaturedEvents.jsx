import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import colors from "../../constants/colors";

const FeaturedEvents = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [error, setError] = useState(null);
    const { eventServiceURL } = useContext(AppContext);
    const { token } = useContext(AppContext);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${eventServiceURL}`, {
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
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900">Featured <span style={{color : colors.accent}}>Events</span></h2>
                    <p className="text-gray-600">Don’t miss these popular upcoming events</p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {featuredEvents.map((event) => (
                        <motion.div
                            key={event.id}
                            whileHover={{ scale: 1.03 }}
                            className="rounded-xl shadow-md overflow-hidden transition transform hover:-translate-y-1"
                            style={{backgroundColor : colors.secondary}} 
                        >
                            <img
                                src={event.image || "/placeholder.png"}
                                alt={event.title}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-6">
                                <span style={{backgroundColor : colors.accent}} className="text-white text-xs font-semibold px-3 py-1 rounded-full">
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
                                    style={{backgroundColor : colors.primary}}
                                    className="w-full mt-5 text-white px-4 py-2 rounded-lg transition block text-center font-medium"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedEvents