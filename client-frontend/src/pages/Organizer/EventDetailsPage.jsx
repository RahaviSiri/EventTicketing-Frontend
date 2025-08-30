import React, { useContext, useEffect } from 'react';
import colors from '../../constants/colors';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const EventDetailsPage = () => {
  const location = useLocation();
  const event = location.state?.event;
  const [seatingChart, setSeatingChart] = React.useState({});
  const { seatingServiceURL } = useContext(AppContext);

  if (!event) {
    return <p>No event data available.</p>;
  }

  useEffect(() => {
    const fetchSeatingChart = async () => {
      try {
        const res = await fetch(`${seatingServiceURL}/event/${event.id}`);
        const data = await res.json();
        const layout = JSON.parse(data.layoutJson);
        setSeatingChart(layout);
      } catch (err) {
        console.error('Error fetching seating chart:', err);
      }
    };
    fetchSeatingChart();
  }, [event]);

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
      {/* Event Image */}
      <div className="overflow-hidden rounded-lg mb-6">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-64 md:h-80 object-cover transform transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Event Title */}
      <h1
        style={{ color: colors.primary }}
        className="text-lg lg:text-3xl font-extrabold mb-3 tracking-tight"
      >
        {event.name}
      </h1>

      <p className="text-gray-500 italic mb-6 tracking-wide text-sm md:text-base">
        {event.category} &bull; <span className="uppercase font-semibold">{event.status}</span>
      </p>

      {/* Date & Time */}
      <section className="mb-7">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800">
          Date &amp; Time
        </h2>
        <p className="text-gray-600 text-sm lg:text-lg">
          {formatDate(event.startDate)} {formatTime(event.startTime)} — {formatDate(event.endDate)} {formatTime(event.endTime)}
        </p>
      </section>

      {/* Venue */}
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

      {/* Description */}
      <section>
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800">
          Event Description
        </h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{event.description}</p>
      </section>

      {/* Seating Chart */}
      <section className="mb-7 mt-4">
        <h2 className="lg:text-xl font-semibold mb-3 border-b border-gray-200 pb-2 text-gray-800">
          Seating Chart
        </h2>

        {/* Legend */}
        <div className="my-4 flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <div style={{ width: 20, height: 20, backgroundColor: '#FFD700', borderRadius: 4 }} />
            <span className="text-sm">VIP</span>
          </div>
          <div className="flex items-center gap-1">
            <div style={{ width: 20, height: 20, backgroundColor: '#4ade80', borderRadius: 4 }} />
            <span className="text-sm">Regular</span>
          </div>
          <div className="flex items-center gap-1">
            <div style={{ width: 20, height: 20, backgroundColor: '#f87171', borderRadius: 4 }} />
            <span className="text-sm">Booked</span>
          </div>
        </div>

        {/* Seats */}
        <div style={{ position: 'relative', width: '600px', height: '400px', border: '1px solid #ccc' }}>
          {seatingChart.seats?.map((seat) => (
            <div
              key={seat.seatNumber}
              style={{
                position: 'absolute',
                left: seat.x,
                top: seat.y,
                width: 40,
                height: 40,
                backgroundColor:
                  seat.status !== 'available'
                    ? '#f87171'
                    : seat.seatType === 'VIP'
                      ? '#FFD700'
                      : '#4ade80',
                color: seat.seatType === 'VIP' ? '#000' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              title={`Seat: ${seat.seatNumber}\nType: ${seat.seatType}\nPrice: $${seat.price}\nStatus: ${seat.status}`}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventDetailsPage;
