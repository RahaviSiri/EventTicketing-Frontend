import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InputattendeeData = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('attendee', JSON.stringify(attendee));
    navigate(`/events/${eventId}/seats`);
  };

  return (
    <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Attendee Information</h2>
      <input type="text" placeholder="Name" required className="w-full mb-3 p-2 border" value={attendee.name} onChange={e => setAttendee({ ...attendee, name: e.target.value })} />
      <input type="email" placeholder="Email" required className="w-full mb-3 p-2 border" value={attendee.email} onChange={e => setAttendee({ ...attendee, email: e.target.value })} />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Next: Select Seat</button>
    </form>
  );
};

export default InputattendeeData;
