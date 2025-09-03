import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter, Star } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token,eventServiceURL } = useContext(AppContext);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${eventServiceURL}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }
        const data = await response.json();

        const mappedData = data.map((ev) => ({
          id: ev.id,
          title: ev.name,
          date: ev.startDate,
          location: ev.venue?.name || 'TBD',
          category: ev.category,
          image: ev.imageUrl,
          price: ev.price,
          rating: ev.rating,
          availableSeats: ev.availableSeats,
        }));

        setEvents(mappedData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const filteredEvents = events.filter(event => {
    const title = event.title || '';
    const location = event.location || '';
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Conference', 'Workshop', 'Seminar', 'Meetup', 'Expo'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Events</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by name or location..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={event.image || '/placeholder.png'}
                  alt={event.title || 'Event'}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {event.category || 'Uncategorized'}
                    </span>
                    {event.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{event.rating}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{event.title || 'Untitled Event'}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location || 'Location TBD'}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    
                    {event.availableSeats !== undefined && (
                      <span className="text-sm text-gray-500">{event.availableSeats} seats left</span>
                    )}
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md transition-colors text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
