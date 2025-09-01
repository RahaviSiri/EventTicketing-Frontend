// src/pages/User/PaymentSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, selectedSeats, totalPrice } = location.state || {};

  if (!event || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No booking data found.</p>
      </div>
    );
  }

  // Generate a unique ticket string (for demo purposes)
  const ticketString = `${event.id}-${selectedSeats.join(",")}-${Date.now()}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <CheckCircle className="mx-auto text-green-500" size={64} />
        <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="text-gray-600">
          You have successfully booked tickets for <strong>{event.name}</strong>
        </p>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">Your Tickets</h2>
          <div className="flex justify-between text-gray-800 font-medium">
            <span>Seats:</span>
            <span>{selectedSeats.join(", ")}</span>
          </div>
          <div className="flex justify-between text-gray-800 font-medium">
            <span>Total Paid:</span>
            <span>Rs.{totalPrice}</span>
          </div>
          <div className="flex justify-between text-gray-800 font-medium">
            <span>Event Date:</span>
            <span>{new Date(event.date).toLocaleString()}</span>
          </div>
        </div>

        <div className="my-4">
          <p className="text-gray-600 mb-2">Scan this QR code at the venue:</p>
          <QRCode value={ticketString} size={180} className="mx-auto" />
        </div>

        <button
          onClick={() => navigate("/events")}
          className="w-full bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700"
        >
          Back to Events
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
