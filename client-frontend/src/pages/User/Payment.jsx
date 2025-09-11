import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { CreditCard, CheckCircle } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import colors from "../../constants/colors";

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
  const { paymentServiceURL,seatingServiceURL , ticketServiceURL,token , userID} = useContext(AppContext);
  const eventId = event?.id;
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    console.log("token:", token);

    const res = await fetch(`${paymentServiceURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userID, 
        amount: totalPrice, 
        currency: "USD",    
        paymentMethod: "card",
      }),
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      setError("Server returned invalid JSON: " + parseErr.message);
      setLoading(false);
      return;
    }

    const clientSecret = data.clientSecret;
    if (!clientSecret) {
      setError(data.message || `Payment endpoint returned status ${res.status}`);
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: "Customer Name" },
      },
    });

    if (result.error) {
  setError(result.error.message);
} else if (result.paymentIntent.status === "succeeded") {
  try {
    // Extract seat numbers from selectedSeats
    const seatNumbers = selectedSeats.map((s) => s.seatNumber);

    const res = await fetch(`${seatingServiceURL}/${eventId}/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ seatNumbers }),
    });

    if (!res.ok) {
      const errData = await res.json();
      alert(`Failed to confirm seats: ${errData.message || "Unknown error"}`);
      return;
    }

    console.log("Seats confirmed:");


    const resp = await fetch(`${ticketServiceURL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
     body: JSON.stringify({
      eventId: event.id,
      userId: userID,         
      seatNumbers: selectedSeats.map(s => s.seatNumber),
      price: totalPrice,
      eventDate: event.startDate
        ? new Date(event.startDate).toISOString() 
        : null,
      venueName: event.venue?.name || "",
      eventName: event.name
    })

    });
        console.log(resp);  
        console.log("Seats confirmedfgdkhgjfgerlsdkufzch");
        const ticketData = await resp.json(); 
        console.log("Ticket created:", ticketData);

    



    // Navigate to success page
    navigate(`/events/${event.id}/success`, {
      state: { event, selectedSeats, totalPrice, ticketData },
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
};


  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <CreditCard size={24} /> Payment Details
      </h2>


      {/* Card Input */}
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <label className="block mb-2 font-medium text-gray-700">Card Information</label>
        <div className="p-3 border rounded bg-gray-50">
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
          />
        </div>
      </div>

      {error && <p className="text-red-500 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          backgroundColor: loading ? 'bg-gray-400' : colors.primary,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        className={`w-full py-3 rounded-lg font-semibold text-white shadow transition-colors`}
      >
        {loading ? "Processing..." : `Pay Rs.${totalPrice}`}
      </button>
    </motion.form>
  );
};

// --- Main Payment Component ---
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fallbacks for safety
  const { event, selectedSeats, totalPrice } = location.state || {};
  if (!event || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No seats selected for payment.</p>
      </div>
    );
  }

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
          <p><strong>Venue:</strong> {event.venue?.name || "N/A"}</p>
          <p><strong>City:</strong> {event.venue?.city || "N/A"}</p>
          <p><strong>Date:</strong> {new Date(event.startDate).toLocaleString()}</p>
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
          <p className="text-xl font-semibold text-blue-600">Total: Rs.{totalPrice}</p>

          
        </motion.div>

        {/* Right: Payment Form */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Elements stripe={stripePromise}>
            <CheckoutForm event={event} selectedSeats={selectedSeats} totalPrice={totalPrice} />
          </Elements>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
