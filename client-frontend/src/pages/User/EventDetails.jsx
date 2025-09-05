import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Star } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { color } from "framer-motion";
import colors from "../../constants/colors";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
const [vipPrice, setVipPrice] = useState(0);
const [normalPrice, setNormalPrice] = useState(0);
  const [event, setEvent] = useState(null);
  const [seatLayout, setSeatLayout] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [error, setError] = useState(null);
  const { eventServiceURL, token, seatingServiceURL } = useContext(AppContext);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch(`${eventServiceURL}/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
  const fetchSeatLayout = async () => {
    if (!event?.seatingChartId) return;

    try {
      const token = localStorage.getItem("EventToken");
      const response = await fetch(
        `${seatingServiceURL}/${event.seatingChartId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch seating layout");
      const data = await response.json();

      const layout = JSON.parse(data.layoutJson); // assuming your API returns { layoutJson: '...' }
      setSeatLayout(layout);

      // Extract prices from seats
      const seats = layout.seats || [];

      const vipSeats = seats.filter((s) => s.seatType === "VIP");
      const normalSeats = seats.filter((s) => s.seatType !== "VIP" && s.status !== "booked");

      if (vipSeats.length > 0) setVipPrice(vipSeats[0].price);
      if (normalSeats.length > 0) setNormalPrice(normalSeats[0].price);

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
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600"></div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? `Error: ${error}` : "Event not found"}
          </h2>
          <Link to="/events" className="text-blue-600 hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[28rem]">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full">
            <span className="bg-blue-600/90 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
              {event.category}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mt-4 mb-3 drop-shadow-lg">
              {event.name}
            </h1>
            <div className="flex items-center text-gray-200 space-x-6 text-sm">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1" />
                {new Date(event.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                {event.venue?.name || "TBA"}
              </div>
              {event.rating && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  {event.rating}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-10">
        {/* Event Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>

            {event.features?.length > 0 && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                  Key Features
                </h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {event.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <DetailCard
                icon={<Calendar style={{color : colors.accent}} className="h-6 w-6" />}
                title="Start Date"
                value={`${new Date(event.startDate).toLocaleDateString()} • ${event.startTime}`}
              />
              {event.endDate && (
                <DetailCard
                  icon={<Clock style={{color : colors.accent}} className="h-6 w-6" />}
                  title="End Date"
                  value={`${new Date(event.endDate).toLocaleDateString()} • ${event.endTime}`}
                />
              )}
              <DetailCard
                icon={<MapPin style={{color : colors.accent}} className="h-6 w-6 " />}
                title="Venue"
                value={
                  <>
                    {event.venue?.name}
                    <p className="text-gray-500 text-sm">{event.venue?.address}</p>
                  </>
                }
              />
              <DetailCard
                icon={<Users style={{color : colors.accent}} className="h-6 w-6" />}
                title="Capacity"
                value={
                  <>
                    {totalSeats} seats total
                    <p className="text-green-600 text-sm">{availableSeats} available</p>
                  </>
                }
              />
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-8 sticky top-10 space-y-8 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-4 bg-white rounded-lg shadow-md">
              {/* VIP Price */}
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  Rs. {vipPrice?.toLocaleString("en-LK") || "0"}
                </div>
                <p className="text-gray-600">VIP ticket</p>
              </div>

              {/* Normal Price */}
              <div className="text-center">
                <div style={{color : colors.primary}} className="text-2xl font-bold mb-1">
                  Rs. {normalPrice?.toLocaleString("en-LK") || "0"}
                </div>
                <p className="text-gray-600">Normal ticket</p>
              </div>
            </div>


            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700">Available Seats</span>
                <span className="text-green-600">
                  {availableSeats} / {totalSeats}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: totalSeats ? `${(availableSeats / totalSeats) * 100}%` : "0%" }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              style={{backgroundColor : colors.primary}}
              className="w-full  text-white  py-4 rounded-lg font-semibold shadow-md transition-colors"
            >
              Select Seats & Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small reusable card for details
const DetailCard = ({ icon, title, value }) => (
  <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
    {icon}
    <div>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-gray-600 text-sm">{value}</p>
    </div>
  </div>
);

export default EventDetail;
