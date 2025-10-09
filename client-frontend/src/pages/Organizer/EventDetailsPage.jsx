import React, { useContext, useEffect, useState } from "react";
import colors from "../../constants/colors";
import { useLocation, useNavigate } from "react-router-dom";
import { HeaderContext } from "../../context/HeaderContext";
import MonthlyRevenue from "./MonthlyRevenue";
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, FaDollarSign, FaChair, FaInfoCircle} from "react-icons/fa";

const EventDetailsPage = () => {
  const location = useLocation();
  const event = location.state?.event;
  const [seatingChart, setSeatingChart] = useState({});
  const [discounts, setDiscounts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [annualRevenue, setAnnualRevenue] = useState([]); // Store revenue for each month of the year
  const { api } = useContext(HeaderContext);
  const navigate = useNavigate();

  if (!event) {
    return <p>No event data available.</p>;
  }

  useEffect(() => {
    const fetchSeatingChart = async () => {
      try {
        const data = await api.getSeatingByEvent(event.id);
        // console.log("data: " + data.layoutJson);
        const layout = JSON.parse(data.layoutJson);
        setSeatingChart(layout);
      } catch (err) {
        console.error("Error fetching seating chart:", err);
      }
    };

    const fetchDiscounts = async () => {
      try {
        const data = await api.getDiscountsByEvent(event.id);
        setDiscounts(data);
      } catch (err) {
        console.error("Error fetching discounts:", err);
      }
    };

    const fetchTotalRevenue = async () => {
      try {
        const data = await api.getRevenueByEvent(event.id);
        console.log("Total Revenue: ", data);
        setTotalRevenue(data);
      } catch (err) {
        console.error("Error fetching total revenue:", err);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const data = await api.getRevenueByEventForMonth(event.id, new Date().getFullYear());
        setAnnualRevenue(data);
      } catch (err) {
        console.error("Error fetching monthly revenue:", err);
      }
    };

    fetchTotalRevenue();
    fetchMonthlyRevenue();
    fetchSeatingChart();
    fetchDiscounts();
  }, [event, api]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(+h, +m);
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Event Image */}
      <div className="overflow-hidden rounded-lg mb-6">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-64 md:h-80 object-cover transform transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Event Title and Create Discount Button */}
      <div className="flex items-center justify-between relative mb-6">
        <h1 style={{ color: colors.primary }} className="text-lg lg:text-3xl font-extrabold tracking-tight">
          {event.name}
        </h1>
        <button
          onClick={() => navigate("/organizers/createDiscount", { state: { event } })}
          style={{ backgroundColor: colors.primary }}
          className="absolute top-0 right-0 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          Create Discount
        </button>
      </div>

      {/* Event Meta */}
      <p className="text-gray-500 italic mb-6 tracking-wide text-sm md:text-base">
        {event.category} &bull; <span className="uppercase font-semibold">{event.status}</span>
      </p>

      {/* Date & Time */}
      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800 flex items-center gap-2">
          <FaCalendarAlt style={{color : colors.primary}}/> Date &amp; <FaClock style={{color : colors.primary}}/> Time
        </h2>
        <p className="text-gray-600 text-sm lg:text-lg">
          {formatDate(event.startDate)} {formatTime(event.startTime)} — {formatDate(event.endDate)}{" "}
          {formatTime(event.endTime)}
        </p>
      </section>

      {/* Venue */}
      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800 flex items-center gap-2">
          <FaMapMarkerAlt style={{color : colors.primary}}/> Venue Details
        </h2>
        <p className="font-semibold text-gray-900 text-sm lg:text-lg">{event.venue.name}</p>
        <p className="text-gray-600 mb-1">
          {event.venue.address}, {event.venue.city}, {event.venue.state} {event.venue.postalCode}, {event.venue.country}
        </p>
        <p className="text-gray-600 mb-2 text-sm lg:text-md">
          Capacity: <span className="font-medium">{event.venue.capacity}</span>
        </p>
        {event.venue.description && (
          <p className="text-gray-500 italic border-l-4 border-primary pl-4">{event.venue.description}</p>
        )}
      </section>

      {/* Description */}
      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800 flex items-center gap-2"><FaInfoCircle style={{color : colors.primary}}/>Event Description</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{event.description}</p>
      </section>

      {/* Revenue Section */}
      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800 flex items-center gap-2">
          <FaDollarSign style={{color : colors.primary}}/> Revenue Overview
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-gray-800">Total Revenue</h3>
            <p className="text-gray-600 text-lg">{totalRevenue ? `$${totalRevenue}` : "Loading..."}</p>
          </div>

          {/* Monthly Revenue Chart */}
          <MonthlyRevenue annualRevenue={annualRevenue} />
        </div>
      </section>

      {/* Seating & Discount */}
      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800 flex items-center gap-2"><FaChair style={{color : colors.primary}}/> Seating & Discounts</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Seating Chart */}
          <div className="flex-1 border p-2 rounded-lg overflow-auto" style={{ minHeight: "400px" }}>
            <h3 className="font-semibold mb-3 text-gray-800">Seating Chart</h3>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1">
                <div style={{ width: 20, height: 20, backgroundColor: "#FFD700", borderRadius: 4 }} />
                <span className="text-sm">VIP</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{ width: 20, height: 20, backgroundColor: "#4ade80", borderRadius: 4 }} />
                <span className="text-sm">Regular</span>
              </div>
              <div className="flex items-center gap-1">
                <div style={{ width: 20, height: 20, backgroundColor: "#f87171", borderRadius: 4 }} />
                <span className="text-sm">Booked</span>
              </div>
            </div>

            <div style={{ position: "relative", width: "150%", height: "500px" }}>
              {seatingChart.seats?.map((seat) => (
                <div
                  key={seat.seatNumber}
                  style={{
                    position: "absolute",
                    left: seat.x,
                    top: seat.y,
                    width: 40,
                    height: 40,
                    backgroundColor:
                      seat.status !== "available" ? "#f87171" : seat.seatType === "VIP" ? "#FFD700" : "#4ade80",
                    color: seat.seatType === "VIP" ? "#000" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                  title={`Seat: ${seat.seatNumber}\nType: ${seat.seatType}\nPrice: $${seat.price}\nStatus: ${seat.status}`}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>

          {/* Discount Codes / Promo Cards */}
          <div className="flex-1 border p-4 rounded-lg overflow-auto" style={{ minHeight: "400px" }}>
            <h3 className="font-semibold mb-3 text-gray-800">Discount Codes</h3>

            {Array.isArray(discounts) && discounts.length > 0 ? (
              discounts.map((d) => (
                <div
                  key={d.id}
                  className="mb-4 p-4 rounded-lg shadow"
                  style={{ backgroundColor: colors.primary, color: "#fff" }}
                >
                  <img src={d.imageURL} alt="" />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No discounts available.</p>
            )}
          </div>


        </div>
      </section>
    </div>
  );
};

export default EventDetailsPage;
