import React, { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { useLocation, useNavigate } from "react-router-dom";
import colors from "../../constants/colors";
import { AppContext } from "../../context/AppContext";

const SeatDesignLayout = ({ onSave }) => {
    const containerRef = useRef();
    const location = useLocation();
    const { eventServiceURL } = useContext(AppContext);

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

    // Generate layout once
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

        const seatsPerRow = 10;
        const spacing = 50;
        const seatsData = [];

        for (let i = 0; i < capacity; i++) {
            const x = 50 + (i % seatsPerRow) * spacing;
            const y = 80 + Math.floor(i / seatsPerRow) * spacing;

            const seatType = i < vipSeatsCount ? "VIP" : "Regular";
            const seatPrice = seatType === "VIP" ? vipPrice : regularPrice;
            const fillColor = seatType === "VIP" ? "#FFD700" : colors.primary;

            const seat =
                shape === "circle"
                    ? new Konva.Circle({
                        x,
                        y,
                        radius: 15,
                        fill: fillColor,
                        draggable: true,
                    })
                    : new Konva.Rect({
                        x: x - 15,
                        y: y - 15,
                        width: 30,
                        height: 30,
                        fill: fillColor,
                        draggable: true,
                    });

            // Set custom attributes
            seat.setAttr("seatType", seatType);
            seat.setAttr("price", seatPrice);
            seat.setAttr("seatNumber", `S${i + 1}`);
            seat.setAttr(
                "row",
                String.fromCharCode(65 + Math.floor(i / seatsPerRow))
            );
            seat.setAttr("section", "Main");
            seat.setAttr("status", "available");

            // Snap to grid on drag
            seat.on("dragmove", () => {
                const gridSize = spacing;
                seat.position({
                    x: Math.round(seat.x() / gridSize) * gridSize,
                    y: Math.round(seat.y() / gridSize) * gridSize,
                });
                updateSeatData(seat);
                layer.draw();
            });

            // Toggle seat type on click
            seat.on("click", () => {
                const newType = seat.getAttr("seatType") === "VIP" ? "Regular" : "VIP";
                seat.setAttr("seatType", newType);
                seat.setAttr("price", newType === "VIP" ? vipPrice : regularPrice);
                seat.fill(newType === "VIP" ? "#FFD700" : colors.primary);
                updateSeatData(seat);
                layer.draw();
            });

            layer.add(seat);

            seatsData.push({
                seatNumber: seat.getAttr("seatNumber"),
                row: seat.getAttr("row"),
                section: seat.getAttr("section"),
                seatType,
                price: seatPrice,
                x: seat.x(),
                y: seat.y(),
                status: "available",
            });
        }

        seatsDataRef.current = seatsData;
        layer.draw();

        return () => stage.destroy();
    }, [vipSeatsCount, vipPrice, regularPrice, shape]);

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

    const handleSave = async () => {
        const json = JSON.stringify({ seats: seatsDataRef.current });
        console.log("Layout JSON:", json);

        if (onSave) onSave(json, eventId);

        try {
            await fetch(`${eventServiceURL}/${eventId}/saveLayout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: eventId, layoutJson: json }),
            });
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
                className="border rounded shadow-md bg-white"
                style={{ width: "100%", minHeight: "500px" }}
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
