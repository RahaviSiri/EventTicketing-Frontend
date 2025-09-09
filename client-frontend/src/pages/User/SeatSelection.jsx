import React, { useEffect, useRef, useState, useContext } from "react";
import Konva from "konva";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import colors from "../../constants/colors";
import { motion } from "framer-motion";
import { Ticket, Crown, Users } from "lucide-react";

const SeatSelection = () => {
  const { token, seatingServiceURL } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const event = location.state?.event;
  const eventId = event?.id;

  const containerRef = useRef();
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const seatsDataRef = useRef([]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [vipPrice, setVipPrice] = useState(0);
  const [normalPrice, setNormalPrice] = useState(0);

  // --- Initialize Konva stage & layer ---
  useEffect(() => {
    if (!containerRef.current) return;

    const stage = new Konva.Stage({
      container: containerRef.current,
      width: containerRef.current.offsetWidth || window.innerWidth * 0.8,
      height: containerRef.current.offsetHeight || 500,
    });
    stageRef.current = stage;

    const layer = new Konva.Layer();
    stage.add(layer);
    layerRef.current = layer;

    return () => stage.destroy();
  }, []);

  // --- Render single seat ---
  const renderSeat = (seatInfo) => {
    const isSelected = selectedSeats.some((s) => s.seatNumber === seatInfo.seatNumber);

    const fillColor =
  seatInfo.status === "booked"
    ? "#FF0000" // red for booked
    : seatInfo.status === "reserved"
    ? "#A0A0A0" // gray for reserved
    : seatInfo.seatType === "VIP"
    ? "#FFD700" // yellow for VIP
    : colors.primary; // normal seats


    const seat = new Konva.Circle({
      x: seatInfo.x,
      y: seatInfo.y,
      radius: 15,
      fill: fillColor,
      stroke: isSelected ? "red" : null,
      strokeWidth: isSelected ? 3 : 0,
      name: `seat-${seatInfo.seatNumber}`,
    });

    seat.on("click", async () => {
  if (seatInfo.status === "booked") return; // cannot click booked seats

  const alreadySelected = selectedSeats.some(
    (s) => s.seatNumber === seatInfo.seatNumber
  );

  try {
    if (alreadySelected) {
      // --- Release seat ---
      const res = await fetch(
        `${seatingServiceURL}/${eventId}/release/${seatInfo.seatNumber}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        seatInfo.status = "available"; // update local status
        setSelectedSeats((prev) =>
          prev.filter((s) => s.seatNumber !== seatInfo.seatNumber)
        );
      }
    } else {
      // --- Reserve seat ---
      const res = await fetch(
        `${seatingServiceURL}/${eventId}/reserve/${seatInfo.seatNumber}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
        
      );
      console.log(token);
      if (res.ok) {
        seatInfo.status = "reserved"; // update local status
        setSelectedSeats((prev) => [...prev, seatInfo]);
      } else {
        alert("Seat not available!");
      }
    }

    // update stroke color & redraw
    seat.stroke(seatInfo.status === "reserved" ? "red" : null);
    seat.strokeWidth(seatInfo.status === "reserved" ? 3 : 0);
    layerRef.current.draw();
  } catch (err) {
    console.error(err);
  }
});


    layerRef.current.add(seat);
  };

  // --- Fetch seating layout ---
  useEffect(() => {
    const fetchLayout = async () => {
      if (!eventId) return;

      try {
        const res = await fetch(
          `${seatingServiceURL}/event/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch seating layout");

        const data = await res.json();
        const seats = data.layoutJson ? JSON.parse(data.layoutJson).seats : [];
        seatsDataRef.current = seats;

        const vipSeats = seats.filter((s) => s.seatType === "VIP");
        const normalSeats = seats.filter(
          (s) => s.seatType !== "VIP" && s.status !== "booked"
        );
        if (vipSeats.length > 0) setVipPrice(vipSeats[0].price);
        if (normalSeats.length > 0) setNormalPrice(normalSeats[0].price);

        seats.forEach(renderSeat);
        layerRef.current.draw();
      } catch (err) {
        console.error(err);
      }
    };

    fetchLayout();
  }, [eventId, token]);

  const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  const handleBooking = async () => {
  if (selectedSeats.length === 0) {
    alert("Please select at least one seat");
    return;
  }

  const seatNumbers = selectedSeats.map((s) => s.seatNumber);

  try {
    const res = await fetch(
      `${seatingServiceURL}/${eventId}/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seatNumbers }),
      }
    );

    if (res.ok) {
      const updated = await res.json();
      updated.forEach((seatResult) => {
        const seat = seatsDataRef.current.find(
          (s) => s.seatNumber === seatResult.seatNumber
        );
        if (seat) seat.status = "booked";
      });

      alert("Seats booked successfully!");
      navigate(`/events/${eventId}/payment`, {
        state: { event, selectedSeats, totalPrice },
      });
    } else {
      alert("Booking failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-4 gap-8">
      {/* Seat Map */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6"
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Ticket className="text-blue-600" /> {event?.name} - Select Seats
        </h1>

        <div
          ref={containerRef}
          className="border rounded-xl shadow-inner bg-gray-50"
          style={{ width: "100%", minHeight: "500px" }}
        />

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-yellow-400 border border-black"></div>
            <span className="text-gray-700 flex items-center gap-1">
              <Crown size={16} className="text-yellow-500" /> VIP: Rs.{vipPrice}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600"></div>
            <span className="text-gray-700">Normal: Rs.{normalPrice}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-600"></div>
            <span className="text-gray-700">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-400"></div>
            <span className="text-gray-700">Reserved</span>
          </div>
        </div>
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 sticky top-8 h-fit"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Users className="text-gray-700" /> Your Selection
        </h2>

        {selectedSeats.length === 0 ? (
          <p className="text-gray-500">No seats selected yet</p>
        ) : (
          <div className="space-y-3">
            {selectedSeats.map((seat) => (
              <div
                key={seat.seatNumber}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
              >
                <span className="text-gray-800 font-medium">
                  {seat.seatNumber} ({seat.seatType})
                </span>
                <span className="text-gray-900 font-semibold">Rs.{seat.price}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4 mt-4 flex justify-between font-semibold text-lg text-gray-800">
          <span>Total</span>
          <span>Rs.{totalPrice}</span>
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700 transition-all duration-200 mt-6"
        >
          Confirm Booking ({selectedSeats.length})
        </button>
      </motion.div>
    </div>
  );
};

export default SeatSelection;
