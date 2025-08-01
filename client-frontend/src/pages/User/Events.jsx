import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tenantId = localStorage.getItem('tenantId') || 'public';
        const token = localStorage.getItem('token');

        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            'X-Tenant-Id': tenantId,
          },
        };

        const response = await axios.get('http://localhost:8080/api/events', config);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} ${date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Events</h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <p className="text-gray-600 text-center">No events found. Check back later!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Date:</span>{' '}
                {event.eventDate ? formatDateTime(event.eventDate) : 'TBD'}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Venue:</span> {event.venue || 'To be announced'}
              </p>
              <p className="text-gray-600 line-clamp-3">{event.description || 'No description available'}</p>
            </div>
            <div className="px-6 pb-6">
              <Link
                to={`/events/${event.id}/tickets`}
                className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition duration-200"
              >
                View Tickets
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
