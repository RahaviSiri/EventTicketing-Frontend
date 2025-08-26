import React from 'react';
import colors from '../../constants/colors';
import { useLocation } from 'react-router-dom';

const EventDetailsPage = () => {

  const location = useLocation();
  const event = location.state?.event;

  if (!event) {
    return <p>No event data available.</p>;
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(+h, +m);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-lg mb-6">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-64 md:h-80 object-cover transform transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h1
        style={{ color: colors.primary }}
        className="text-lg lg:text-3xl font-extrabold mb-3 tracking-tight"
      >
        {event.name}
      </h1>

      <p className="text-gray-500 italic mb-6 tracking-wide text-sm md:text-base">
        {event.category} &bull; <span className="uppercase font-semibold">{event.status}</span>
      </p>

      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800">
          Date &amp; Time
        </h2>
        <p className="text-gray-600 text-sm lg:text-lg">
          {formatDate(event.startDate)} {formatTime(event.startTime)} — {formatDate(event.endDate)} {formatTime(event.endTime)}
        </p>
      </section>

      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800">
          Venue Details
        </h2>
        <p className="font-semibold text-gray-900 text-sm lg:text-lg">{event.venue.name}</p>
        <p className="text-gray-600 mb-1">
          {event.venue.address}, {event.venue.city}, {event.venue.state} {event.venue.postalCode}, {event.venue.country}
        </p>
        <p className="text-gray-600 mb-2 text-sm lg:text-md">Capacity: <span className="font-medium">{event.venue.capacity}</span></p>
        {event.venue.description && (
          <p className="text-gray-500 italic border-l-4 border-primary pl-4">{event.venue.description}</p>
        )}
      </section>

      <section>
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800">
          Event Description
        </h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{event.description}</p>
      </section>
    </div>
  );
};

export default EventDetailsPage;
