import React, { useEffect, useRef, useState, useContext } from "react";
import Konva from "konva";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import colors from "../../constants/colors";

const SeatSelection = () => {
  const { token } = useContext(AppContext);
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
    const isSelected = selectedSeats.includes(seatInfo.seatNumber);

    const fillColor =
      seatInfo.status === "booked"
        ? "#FF0000"
        : seatInfo.seatType === "VIP"
        ? "#FFD700"
        : colors.primary;

    const seat = new Konva.Circle({
      x: seatInfo.x,
      y: seatInfo.y,
      radius: 15,
      fill: fillColor,
      stroke: isSelected ? "red" : null,
      strokeWidth: isSelected ? 3 : 0,
      name: `seat-${seatInfo.seatNumber}`,
    });

    // Click to select/unselect available seats
    seat.on("click", () => {
      if (seatInfo.status === "booked") return;

      setSelectedSeats((prev) => {
        const updated = prev.includes(seatInfo.seatNumber)
          ? prev.filter((s) => s !== seatInfo.seatNumber)
          : [...prev, seatInfo.seatNumber];

        seat.stroke(updated.includes(seatInfo.seatNumber) ? "red" : null);
        seat.strokeWidth(updated.includes(seatInfo.seatNumber) ? 3 : 0);
        layerRef.current.draw();

        return updated;
      });
    });

    layerRef.current.add(seat);
  };

  // --- Fetch seating layout ---
  useEffect(() => {
    const fetchLayout = async () => {
      if (!eventId) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/seating-charts/event/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch seating layout");

        const data = await res.json();
        const seats = data.layoutJson ? JSON.parse(data.layoutJson).seats : [];
        seatsDataRef.current = seats;

        // Set VIP/Normal prices from JSON
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

  // --- Calculate total price ---
  const totalPrice = selectedSeats.reduce((total, seatNum) => {
    const seat = seatsDataRef.current.find((s) => s.seatNumber === seatNum);
    return seat ? total + seat.price : total;
  }, 0);

  // --- Handle booking ---
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    navigate(`/events/${eventId}/payment`, { state: { event, selectedSeats, totalPrice } });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid lg:grid-cols-4 gap-6">
      {/* Seat Map */}
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold mb-4">{event?.name} - Select Seats</h1>
        <div
          ref={containerRef}
          className="border rounded shadow-md bg-white"
          style={{ width: "100%", minHeight: "500px" }}
        />

        {/* Legend / Seat Prices */}
        <div className="mt-6 flex justify-start space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-yellow-400 border border-black"></div>
            <span>VIP Seat: Rs.{vipPrice}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-blue-600"></div>
            <span>Normal Seat: Rs.{normalPrice}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-red-600"></div>
            <span>Booked Seat</span>
          </div>
        </div>
      </div>

      {/* Sidebar: Selected Seats */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 sticky top-8 space-y-4">
        <h2 className="text-xl font-bold mb-2">Your Selection</h2>

        {selectedSeats.length === 0 ? (
          <p className="text-gray-600">No seats selected</p>
        ) : (
          <div className="space-y-2">
            {selectedSeats.map((seatNum) => {
              const seat = seatsDataRef.current.find((s) => s.seatNumber === seatNum);
              return (
                <div key={seatNum} className="flex justify-between text-gray-800">
                  <span>{seat.seatNumber} ({seat.seatType})</span>
                  <span>Rs.{seat.price}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Total Price</span>
          <span>Rs.{totalPrice}</span>
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 mt-4"
        >
          Confirm Booking ({selectedSeats.length})
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
