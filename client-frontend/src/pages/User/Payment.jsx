import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Payment = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handlePayment = () => {
    // simulate payment
    navigate(`/events/${eventId}/confirmation`);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Payment</h2>
      <p>Ticket Price: $20</p>
      <button onClick={handlePayment} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Confirm Payment</button>
    </div>
  );
};

export default Payment;
