import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/events/${eventId}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [eventId]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
      <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p className="mt-4">{event.description}</p>

      <button
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={() => navigate(`/events/${eventId}/attendee`)}
      >
        Next: Attendee Info
      </button>
    </div>
  );
};

export default EventDetails;
