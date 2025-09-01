// src/pages/User/Payment.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RlZTHHtjMJALymh2E5t3Gnn5C2ViS2jSIL1Nuop16zrmddAfaM41kWxv93ItFg2JSSc2TCG8u8jRLsb3osHwwuj00g9AnZ04g"
);

// --- Checkout Form ---
const CheckoutForm = ({ event, selectedSeats, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on backend
      const res = await fetch("http://localhost:8080/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice * 100, // Stripe expects amount in cents
          currency: "LKR",
          eventId: event.id,
          seats: selectedSeats,
        }),
      });

      const { clientSecret } = await res.json();

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: "Customer Name" }, // optionally get from input
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        navigate(`/events/${event.id}/success`, {
          state: { event, selectedSeats, totalPrice },
        });
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>

      {/* Event Summary */}
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm space-y-2">
        <p><strong>Event:</strong> {event.name}</p>
        <p><strong>Venue:</strong> {event.venue?.name || "N/A"}</p>
        <p><strong>City:</strong> {event.venue?.city || "N/A"}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
        <p className="text-lg font-semibold">Total: Rs.{totalPrice}</p>
      </div>

      {/* Card Input */}
      <div className="p-4 border rounded-lg">
        <label className="block mb-2 font-medium text-gray-700">Card Information</label>
        <div className="p-3 border rounded bg-white">
<CardElement
  options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": { color: "#a0aec0" },
        fontFamily: "Arial, sans-serif",
      },
      invalid: { color: "#fa755a" },
    },
    hidePostalCode: true,
  }}
/>        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 rounded-lg font-semibold text-white shadow ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : `Pay Rs.${totalPrice}`}
      </button>
    </form>
  );
};

// --- Main Payment Component ---
const Payment = () => {
  const location = useLocation();
  const { event, selectedSeats, totalPrice } = location.state || {};

  if (!event || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No seats selected for payment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">
        {/* Left: Event Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
          <p><strong>Venue:</strong> {event.venue?.name || "N/A"}</p>
          <p><strong>City:</strong> {event.venue?.city || "N/A"}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
          <p className="text-xl font-semibold">Total: Rs.{totalPrice}</p>
        </div>

        {/* Right: Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Elements stripe={stripePromise}>
            <CheckoutForm event={event} selectedSeats={selectedSeats} totalPrice={totalPrice} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Payment;
