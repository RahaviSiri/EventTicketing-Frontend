import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import colors from "../../constants/colors";

const ScanQR = () => {
  const [events, setEvents] = useState([
    { id: 1, title: "Music Festival" },
    { id: 2, title: "Tech Conference" },
    { id: 3, title: "Charity Gala" },
  ]); // Replace with backend API later
  const [selectedEvent, setSelectedEvent] = useState("");
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    codeReader.current = new BrowserQRCodeReader();
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop(); 
        // this releases the camera when unmounting
      }
    };

  }, []);

  const startScanning = () => {
    if (!selectedEvent) {
      alert("Please select an event first.");
      return;
    }
    setScanning(true);
    codeReader.current
      .decodeFromVideoDevice(
        null,
        videoRef.current,
        (res, err) => {
          if (res) {
            setResult(res.getText());
            // TODO: send to backend -> axios.post("/api/attendance", { selectedEvent, ticketId: res.getText() })
          }
        }
      )
      .then((controls) => {
        controlsRef.current = controls; 
        // store controls so we can stop later
      })
      .catch((err) => console.error(err));
  };

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop(); // stop camera manually
    }
    setScanning(false);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>Scan QR for Attendance</h1>

      {/* Event Dropdown */}
      <select
        className="border p-2 rounded w-64"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">-- Select Event --</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </select>

      {/* Camera Controls */}
      <div className="flex gap-4">
        {!scanning ? (
          <button
            onClick={startScanning}
            className="px-4 py-2 text-white rounded-lg shadow " style={{ backgroundColor: colors.primary }}
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

      {/* Video Preview */}
      {scanning && (
        <div className="w-80 h-80 border-4 border-indigo-400 rounded-xl overflow-hidden shadow-lg">
          <video ref={videoRef} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Scan Result */}
      {result && (
        <p className="text-lg font-semibold text-gray-800">
          ✅ Ticket ID: <span className="text-green-600">{result}</span>
        </p>
      )}
    </div>
  );
};

export default ScanQR;
