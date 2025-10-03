import React from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { CheckoutForm } from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- Main Payment Component ---
const Payment = () => {
  const location = useLocation();

  // Fallbacks for safety
  const { event, selectedSeats, totalPrice } = location.state || {};
  if (!event || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No seats selected for payment.</p>
      </div>
    );
  }
  const eventDateTime = event.startDate && event.startTime
    ? `${event.startDate}T${event.startTime}`
    : null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
        {/* Left: Event Summary */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle size={24} /> {event.name}
          </h1>
          <p>
            <strong>Venue:</strong> {event.venue?.name || "N/A"}
          </p>
          <p>
            <strong>City:</strong> {event.venue?.city || "N/A"}
          </p>
          <p>
            <strong>Date:</strong> {eventDateTime}
          </p>
          <div>
            <strong>Seats:</strong>
            <ul className="list-disc list-inside">
              {selectedSeats.map((seat, index) => (
                <li key={index}>
                  {seat.seatNumber} – {seat.seatType} (Rs.{seat.price})
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xl font-semibold text-blue-600">
            Total: Rs.{totalPrice}
          </p>
        </motion.div>

        {/* Right: Payment Form */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Elements stripe={stripePromise}>
            <CheckoutForm
              event={event}
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
            />
          </Elements>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
