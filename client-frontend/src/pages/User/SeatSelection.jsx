import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { ArrowLeft, Users, DollarSign } from 'lucide-react';

const SeatSelection = () => {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Generate mock seat data
    const mockSeats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    rows.forEach((row) => {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const isBooked = Math.random() < 0.2; // 20% booked randomly
        mockSeats.push({
          id: `${row}${seatNum}`,
          row,
          number: seatNum,
          price: 299,
          status: isBooked ? 'booked' : 'available',
          type: 'standard'
        });
      }
    });

    setTimeout(() => {
      setSeats(mockSeats);
      setLoading(false);
    }, 1000);
  }, [user, navigate]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked' || seat.status === 'reserved') return;

    setSeats(prevSeats =>
      prevSeats.map(s =>
        s.id === seat.id
          ? { ...s, status: s.status === 'selected' ? 'available' : 'selected' }
          : s
      )
    );

    setSelectedSeats(prevSelected => {
      const isAlreadySelected = prevSelected.find(s => s.id === seat.id);
      if (isAlreadySelected) {
        return prevSelected.filter(s => s.id !== seat.id);
      } else {
        return [...prevSelected, { ...seat, status: 'selected' }];
      }
    });
  };

  const getSeatColor = (seat) => {
    switch (seat.status) {
      case 'available':
        return 'fill-green-200 hover:fill-green-300 cursor-pointer';
      case 'selected':
        return 'fill-yellow-400';
      case 'booked':
        return 'fill-red-400 cursor-not-allowed';
      default:
        return 'fill-gray-200';
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) return;
    
    const bookingData = {
      eventId: id,
      seats: selectedSeats,
      totalPrice
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    navigate('/booking');
  };

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/events/${id}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Event</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Select Your Seats</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Seat Map SVG */}
              <div className="flex justify-center mb-8">
                <svg width="600" height="400" viewBox="0 0 600 400" className="border rounded-lg">
                  {seats.map((seat) => {
                    const rowIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].indexOf(seat.row);
                    const x = 50 + (seat.number - 1) * 45;
                    const y = 50 + rowIndex * 40;

                    return (
                      <g key={seat.id}>
                        <rect
                          x={x}
                          y={y}
                          width="35"
                          height="30"
                          rx="5"
                          className={getSeatColor(seat)}
                          onClick={() => handleSeatClick(seat)}
                        />
                        <text
                          x={x + 17.5}
                          y={y + 20}
                          textAnchor="middle"
                          className="text-xs font-medium fill-gray-700 pointer-events-none"
                        >
                          {seat.row}{seat.number}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Row labels */}
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((row, index) => (
                    <text
                      key={row}
                      x={20}
                      y={65 + index * 40}
                      textAnchor="middle"
                      className="text-sm font-semibold fill-gray-700"
                    >
                      {row}
                    </text>
                  ))}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {selectedSeats.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Select seats to see your booking summary
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Users className="h-5 w-5" />
                    <span>{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected</span>
                  </div>

                  <div className="space-y-2">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm">
                          Seat {seat.row}{seat.number}
                        </span>
                        <span className="font-medium">${seat.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${totalPrice}
                      </span>
                    </div>

                    <button
                      onClick={handleProceedToBooking}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <DollarSign className="h-5 w-5" />
                      <span>Proceed to Payment</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
