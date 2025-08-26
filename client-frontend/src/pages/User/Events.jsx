import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Filter, Star } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call - replace with actual API
    const mockEvents = [
      {
        id: 1,
        title: "Colombo Tech Summit 2026",
        date: "2026-03-15",
        location: "Colombo, Sri Lanka",
        image:
          "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1500,
        category: "Technology",
        rating: 4.5,
        availableSeats: 50,
      },
      {
        id: 2,
        title: "Colombo Music Festival",
        date: "2026-06-20",
        location: "Colombo, Sri Lanka",
        image:
          "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1200,
        category: "Music",
        rating: 4.7,
        availableSeats: 100,
      },
      {
        id: 3,
        title: "Jaffna Music Festival",
        date: "2026-07-05",
        location: "Jaffna, Sri Lanka",
        image:
          "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 1000,
        category: "Music",
        rating: 4.6,
        availableSeats: 80,
      },
      {
        id: 4,
        title: "Galle Literary Festival",
        date: "2026-01-20",
        location: "Galle, Sri Lanka",
        image:
          "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800",
        price: 800,
        category: "Literature",
        rating: 4.8,
        availableSeats: 40,
      },
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Technology', 'Music', 'Art', 'Business', 'Food'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Events</h1>
          
          {/* Search and Filter */}
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

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {event.category}
                    </span>
                    {event.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{event.rating}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      Rs. {event.price.toLocaleString("en-LK")}
                    </span>
                    {event.availableSeats !== undefined && (
                      <span className="text-sm text-gray-500">
                        {event.availableSeats} seats left
                      </span>
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
