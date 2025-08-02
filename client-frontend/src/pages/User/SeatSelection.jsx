import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SeatSelection = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleSelect = () => {
    localStorage.setItem('selectedSeat', 'A1');
    navigate(`/events/${eventId}/payment`);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Seat Selection</h2>
      <p>Seat A1 is available.</p>
      <button onClick={handleSelect} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">Next: Payment</button>
    </div>
  );
};

export default SeatSelection;
