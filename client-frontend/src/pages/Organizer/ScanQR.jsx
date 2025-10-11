import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import colors from "../../constants/colors";
import { HeaderContext } from "../../context/HeaderContext";
import { AppContext } from "../../context/AppContext";

const ScanQR = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);

  const { api } = useContext(HeaderContext);
  const { userID } = useContext(AppContext);

  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const controlsRef = useRef(null);

  // Initialize QR code reader once
  useEffect(() => {
    codeReader.current = new BrowserQRCodeReader();
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  // Fetch events for this organizer
  useEffect(() => {
    if (!userID) return;

    const fetchEvents = async () => {
      try {
        const data = await api.getEventsByOrganizer(userID);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [api, userID]);

  // Handle check-in after scanning
  const handleCheckIn = async (ticketNumber) => {
    try {
      const ticket = await api.getTicketByTicketNumber(ticketNumber);
      console.log("Fetched ticket:", ticket);

      if (!ticket || !ticket.id) {
        alert("❌ Invalid ticket number.");
        return;
      }
      console.log(ticket.id);
      const checkIn = true;
      const response = await api.updateOrderCheckIn(ticket.id, checkIn);
      if (response.ok) {
        alert(`✅ Check-in successful for ticket #${ticket.ticketNumber}`);
      } else {
        console.error("Failed to update check-in:", response);
        alert("❌ Failed to update check-in status.");
      }

    } catch (error) {
      console.error("Error updating check-in:", error.message);
      alert("Failed to update check-in status.");
    }
  };

  // Start scanning — only sets the flag
  const startScanning = () => {
    if (!selectedEvent) {
      alert("Please select an event first.");
      return;
    }
    setResult("");
    setScanning(true);
  };

  // Stop scanning and cleanup
  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
    }
    setScanning(false);
  };

  // 🔹 This runs AFTER the <video> element is rendered
  useEffect(() => {
    if (scanning && videoRef.current && codeReader.current) {
      codeReader.current
        .decodeFromVideoDevice(null, videoRef.current, (res, err) => {
          if (res) {
            const ticketNumber = res.getText();
            setResult(ticketNumber);
            stopScanning();
            handleCheckIn(ticketNumber);
          }
          if (err && !(err.name === "NotFoundException")) {
            console.error("Scanning error:", err);
          }
        })
        .then((controls) => {
          controlsRef.current = controls;
        })
        .catch((err) => {
          console.error("Error initializing scanner:", err);
          alert("Failed to initialize scanner.");
          setScanning(false);
        });
    }

    // Cleanup when scanning stops
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [scanning]);

  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
        Scan QR for Attendance
      </h1>

      {/* Event selector */}
      <select
        className="border p-2 rounded w-64"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">-- Select Event --</option>
        {events.map((event) => (
          <option key={event.event.id} value={event.event.name}>
            {event.event.name}
          </option>
        ))}
      </select>

      {/* Control buttons */}
      <div className="flex gap-4">
        {!scanning ? (
          <button
            onClick={startScanning}
            className="px-4 py-2 text-white rounded-lg shadow"
            style={{ backgroundColor: colors.primary }}
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            Stop Scanning
          </button>
        )}
      </div>

      {/* Video preview */}
      {scanning && (
        <div className="w-80 h-80 border-4 border-indigo-400 rounded-xl overflow-hidden shadow-lg">
          <video ref={videoRef} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Scan result */}
      {result && (
        <p className="text-lg font-semibold text-gray-800">
          ✅ Scanned Ticket / Order ID:{" "}
          <span className="text-green-600">{result}</span>
        </p>
      )}
    </div>
  );
};

export default ScanQR;
