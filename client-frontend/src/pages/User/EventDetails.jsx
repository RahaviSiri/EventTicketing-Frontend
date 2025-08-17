import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Star, Share, Heart } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Mock API call - replace with your backend API
    const mockEvent = {
      id: parseInt(id || '1'),
      title: 'Colombo Tech Summit 2024',
      description:
        'Join us for the biggest technology conference of the year! Featuring keynote speakers, hands-on workshops, and networking opportunities.',
      date: '2026-03-15',
      time: '09:00 AM',
      location: 'Colombo, Sri Lanka',
      venue: 'BMICH Conference Hall',
      image:
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200',
      price: 1500,
      category: 'Technology',
      rating: 4.7,
      totalSeats: 500,
      availableSeats: 250,
      organizer: 'TechEvents Inc.',
      features: ['Keynote Speakers', 'Workshops', 'Networking', 'Certificate', 'Swag Bag'],
    };

    setTimeout(() => {
      setEvent(mockEvent);
      setLoading(false);
    }, 800);
  }, [id]);

  // const handleBookNow = () => {
  //   navigate(`/events/${id}/seats`);
  // };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-800">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex justify-between items-start">
            <div>
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold text-white mt-4 mb-2">{event.title}</h1>
              <div className="flex items-center text-white space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{event.rating}</span>
                </div>
                <span>by {event.organizer}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* <button
                onClick={() => setLiked(!liked)}
                className={`p-3 rounded-full transition-colors ${
                  liked ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
              </button> */}
              {/* <button
                onClick={handleShare}
                className="p-3 bg-white text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Share className="h-6 w-6" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        {/* Event Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Features</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {event.features.map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Time</p>
                  <p className="text-gray-600">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Venue</p>
                  <p className="text-gray-600">{event.venue}</p>
                  <p className="text-gray-500 text-sm">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Capacity</p>
                  <p className="text-gray-600">{event.totalSeats} seats total</p>
                  <p className="text-green-600 text-sm">{event.availableSeats} available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                Rs. {event.price.toLocaleString('en-LK')}
              </div>
              <p className="text-gray-600">per ticket</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Available Seats</span>
                <span className="font-semibold text-green-600">
                  {event.availableSeats} / {event.totalSeats}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* <button
              onClick={handleBookNow}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Select Seats & Book Now
            </button> */}

            <p className="text-center text-sm text-gray-500">
              Free cancellation up to 24 hours before the event
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
