import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seatLayout, setSeatLayout] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("EventToken");
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch event: ${response.status}`);

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Fetch Seating Layout
useEffect(() => {
  const fetchSeatLayout = async () => {
    if (!event?.seatingChartId) return;

    try {
      const token = localStorage.getItem("EventToken");
      const response = await fetch(
        `http://localhost:8080/api/seating-charts/${event.seatingChartId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch seating layout");

      const data = await response.json();

      // Parse JSON string into JS object
      const layout = JSON.parse(data.layoutJson); 
      setSeatLayout(layout);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSeats(false);
    }
  };

  fetchSeatLayout();
}, [event]);

  const handleBookNow = () => {
  navigate(`/events/${eventId}/seats`, { state: { event } });
};

const totalSeats = seatLayout?.seats?.length || 0;
const availableSeats =
  seatLayout?.seats?.filter((s) => s.status === "available").length || 0;


  if (loadingEvent)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? `Error: ${error}` : "Event not found"}
          </h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-800">
            Back to Events
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex justify-between items-start">
            <div>
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold text-white mt-4 mb-2">{event.name}</h1>
              <div className="flex items-center text-white space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{event.rating || 0}</span>
                </div>
                <span>Organizer ID: {event.organizerId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        {/* Event Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>

            {event.features?.length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Features</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {event.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Start Date</p>
                  <p className="text-gray-600">{new Date(event.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Time: {event.startTime}</p>
                </div>
              </div>

              {event.endDate && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">End Date</p>
                    <p className="text-gray-600">{new Date(event.endDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">Time: {event.endTime}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Venue</p>
                  <p className="text-gray-600">{event.venue?.name}</p>
                  <p className="text-gray-500 text-sm">{event.venue?.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Capacity</p>
                  <p className="text-gray-600">{totalSeats} seats total</p>
                  <p className="text-green-600 text-sm">{availableSeats} available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 space-y-6">
            {/* <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                Rs. {event.price?.toLocaleString("en-LK") || "0"}
              </div>
              <p className="text-gray-600">per ticket</p>
            </div> */}

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Available Seats</span>
                <span className="font-semibold text-green-600">
                  {availableSeats} / {totalSeats}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: totalSeats ? `${(availableSeats / totalSeats) * 100}%` : "0%" }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Select Seats & Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
