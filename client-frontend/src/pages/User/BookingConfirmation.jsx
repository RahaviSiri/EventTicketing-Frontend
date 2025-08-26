import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Calendar, MapPin, Mail, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    const storedBooking = localStorage.getItem('bookingConfirmation');
    if (storedBooking) {
      const bookingData = JSON.parse(storedBooking);
      setBooking(bookingData);
      
      // Generate QR code
      const qrData = {
        bookingId: bookingData.bookingId,
        eventId: bookingData.eventId,
        seats: bookingData.seats.map((s) => s.id),
        attendee: `${bookingData.userDetails.firstName} ${bookingData.userDetails.lastName}`
      };
      
      QRCode.toDataURL(JSON.stringify(qrData))
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error(err));
    } else {
      navigate('/events');
    }
  }, [navigate]);

  const downloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert('Ticket download functionality would be implemented here');
  };

  const sendConfirmationEmail = () => {
    // In a real app, this would trigger an email
    alert('Confirmation email sent!');
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your tickets have been successfully booked
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Booking Details</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Booking Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium">{booking.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600 capitalize">{booking.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Attendee Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {booking.userDetails.firstName} {booking.userDetails.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{booking.userDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{booking.userDetails.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Seats</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {booking.seats.map(seat => (
                  <div key={seat.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Seat {seat.row}{seat.number}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">{seat.type} Section</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${seat.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Paid</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${booking.totalPrice + 5}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">March 15, 2024</p>
                    <p className="text-sm text-gray-600">9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Moscone Center</p>
                    <p className="text-sm text-gray-600">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* QR Code */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Ticket QR Code</h3>
                {qrCodeDataUrl && (
                  <div className="flex justify-center mb-4">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Booking QR Code" 
                      className="w-48 h-48 border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Show this QR code at the event entrance
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={downloadTicket}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Ticket</span>
                </button>

                <button
                  onClick={sendConfirmationEmail}
                  className="w-full bg-green-600 text-white hover:bg-green-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="h-5 w-5" />
                  <span>Email Confirmation</span>
                </button>

                <Link
                  to="/events"
                  className="w-full bg-gray-600 text-white hover:bg-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors text-center block"
                >
                  Browse More Events
                </Link>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Arrive 30 minutes before the event</li>
                  <li>• Bring a valid photo ID</li>
                  <li>• Save this QR code on your phone</li>
                  <li>• Free cancellation until 24h before</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
