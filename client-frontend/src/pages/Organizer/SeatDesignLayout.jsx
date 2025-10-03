import React, { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { useLocation, useNavigate } from "react-router-dom";
import colors from "../../constants/colors";
import { AppContext } from "../../context/AppContext";
import { HeaderContext } from "../../context/HeaderContext"

const SeatDesignLayout = ({ onSave }) => {
  const containerRef = useRef();
  const location = useLocation();
  const { token } = useContext(AppContext);
  const { api } = useContext(HeaderContext); 

  const event = location.state?.event;
  const capacity = event?.venue?.capacity || 0;
  const eventId = event?.id;

  const [shape, setShape] = useState("circle");
  const [vipPrice, setVipPrice] = useState(100);
  const [regularPrice, setRegularPrice] = useState(50);
  const [vipSeatsCount, setVipSeatsCount] = useState(0);

  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const seatsDataRef = useRef([]);

  const navigate = useNavigate();

  // --- Initialize Konva stage & layer ---
  useEffect(() => {
    if (!capacity) return;

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
  }, [capacity]);

  // --- Render single seat ---
  const renderSeat = (seatInfo) => {
    const fillColor = seatInfo.seatType === "VIP" ? "#FFD700" : colors.primary;
    const seat =
      shape === "circle"
        ? new Konva.Circle({
            x: seatInfo.x,
            y: seatInfo.y,
            radius: 15,
            fill: fillColor,
            draggable: true,
            name: `seat-${seatInfo.seatNumber}`,
          })
        : new Konva.Rect({
            x: seatInfo.x - 15,
            y: seatInfo.y - 15,
            width: 30,
            height: 30,
            fill: fillColor,
            draggable: true,
            name: `seat-${seatInfo.seatNumber}`,
          });

    seat.setAttr("seatType", seatInfo.seatType);
    seat.setAttr("price", seatInfo.price);
    seat.setAttr("seatNumber", seatInfo.seatNumber);

    // Snap to grid
    seat.on("dragmove", () => {
      const gridSize = 50;
      seat.position({
        x: Math.round(seat.x() / gridSize) * gridSize,
        y: Math.round(seat.y() / gridSize) * gridSize,
      });
      updateSeatData(seat);
      layerRef.current.draw();
    });

    // Toggle type on click
    seat.on("click", () => {
      const newType = seat.getAttr("seatType") === "VIP" ? "Regular" : "VIP";
      seat.setAttr("seatType", newType);
      seat.setAttr("price", newType === "VIP" ? vipPrice : regularPrice);
      seat.fill(newType === "VIP" ? "#FFD700" : colors.primary);
      updateSeatData(seat);
      layerRef.current.draw();
    });

    layerRef.current.add(seat);
    return seat;
  };

  // --- Update seat data in ref ---
  const updateSeatData = (seat) => {
    const index = seatsDataRef.current.findIndex(
      (s) => s.seatNumber === seat.getAttr("seatNumber")
    );
    if (index !== -1) {
      seatsDataRef.current[index] = {
        ...seatsDataRef.current[index],
        seatType: seat.getAttr("seatType"),
        price: seat.getAttr("price"),
        x: seat.x(),
        y: seat.y(),
      };
    }
  };

  // --- Fetch existing layout once ---
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const data = await api.getSeatingByEvent(eventId); 
        const existingSeats = data.layoutJson ? JSON.parse(data.layoutJson).seats : [];

        if (existingSeats.length > 0) {
          seatsDataRef.current = existingSeats;
          existingSeats.forEach(renderSeat);

          setVipPrice(
            existingSeats.find((s) => s.seatType === "VIP")?.price || vipPrice
          );
          setRegularPrice(
            existingSeats.find((s) => s.seatType === "Regular")?.price || regularPrice
          );
          setVipSeatsCount(existingSeats.filter((s) => s.seatType === "VIP").length);
        } else {
          generateDefaultSeats();
        }

        layerRef.current.draw();
      } catch (err) {
        generateDefaultSeats();
        console.error(err);
      }
    };

    const generateDefaultSeats = () => {
      const seats = [];
      const seatsPerRow = 10;
      const spacing = 50;

      let maxX = 0;
      let maxY = 0;

      for (let i = 0; i < capacity; i++) {
        const x = 50 + (i % seatsPerRow) * spacing;
        const y = 80 + Math.floor(i / seatsPerRow) * spacing;
        const seatType = i < vipSeatsCount ? "VIP" : "Regular";
        const seatPrice = seatType === "VIP" ? vipPrice : regularPrice;

        seats.push({
          seatNumber: `S${i + 1}`,
          row: String.fromCharCode(65 + Math.floor(i / seatsPerRow)),
          section: "Main",
          seatType,
          price: seatPrice,
          x,
          y,
          status: "available",
        });

        // track max size
        maxX = Math.max(maxX, x + 50);
        maxY = Math.max(maxY, y + 50);
      }

      // update stage size so scroll works
      stageRef.current.width(maxX);
      stageRef.current.height(maxY);

      seatsDataRef.current = seats;
      seats.forEach(renderSeat);
    };

    fetchLayout();
  }, [capacity, api, eventId, token]);

  // --- Update seats when VIP/Regular price or count changes ---
  useEffect(() => {
    if (!layerRef.current) return;
    seatsDataRef.current.forEach((s, idx) => {
      const seat = layerRef.current.findOne(`.seat-${s.seatNumber}`);
      if (!seat) return;

      const newType = idx < vipSeatsCount ? "VIP" : "Regular";
      s.seatType = newType;
      s.price = newType === "VIP" ? vipPrice : regularPrice;

      seat.setAttr("seatType", newType);
      seat.setAttr("price", s.price);
      seat.fill(newType === "VIP" ? "#FFD700" : colors.primary);
    });
    layerRef.current.draw();
  }, [vipPrice, regularPrice, vipSeatsCount]);

  // --- Save layout ---
  const handleSave = async () => {
    const json = JSON.stringify({ seats: seatsDataRef.current });
    if (onSave) onSave(json, eventId);

    try {
      await api.saveSeatingLayout(eventId, json); 
      alert("Layout saved successfully!");
      navigate("/organizers/viewEvent");
    } catch (err) {
      console.error("Error saving layout", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Design Seating Layout</h1>
      <p className="text-gray-600 mb-6">Venue capacity: {capacity} seats</p>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="font-medium mr-2">Seat Shape:</label>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="circle">Circle</option>
            <option value="square">Square</option>
          </select>
        </div>

        <div>
          <label className="font-medium mr-2">Number of VIP Seats:</label>
          <input
            type="number"
            value={vipSeatsCount}
            onChange={(e) => setVipSeatsCount(Number(e.target.value))}
            min={0}
            max={capacity}
            className="border rounded-md p-2 w-20"
          />
        </div>

        <div>
          <label className="font-medium mr-2">VIP Price:</label>
          <input
            type="number"
            value={vipPrice}
            onChange={(e) => setVipPrice(Number(e.target.value))}
            className="border rounded-md p-2 w-20"
          />
        </div>

        <div>
          <label className="font-medium mr-2">Regular Price:</label>
          <input
            type="number"
            value={regularPrice}
            onChange={(e) => setRegularPrice(Number(e.target.value))}
            className="border rounded-md p-2 w-20"
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="border rounded shadow-md bg-white overflow-auto"
        style={{ width: "100%", minHeight: "500px" , position: "relative" }}
      />

      <button
        onClick={handleSave}
        style={{ backgroundColor: colors.primary }}
        className="mt-6 px-5 py-2 rounded text-white shadow"
      >
        Save Layout
      </button>
    </div>
  );
};

export default SeatDesignLayout;
