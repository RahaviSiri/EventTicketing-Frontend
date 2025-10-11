import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Download, Mail, Calendar, MapPin, Tag } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import colors from "../../constants/colors";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, selectedSeats, finalPrice, seatDetails, ticketData } = location.state || {};
  const qrRef = useRef();

  useEffect(() => {
    if (!event || !selectedSeats || selectedSeats.length === 0) navigate("/events");
  }, [event, selectedSeats, navigate]);

  const downloadTicket = () => {
    if (!event) return;

    let qrDataUrl = "";
    if (ticketData?.qrCode) {
      qrDataUrl = `data:image/png;base64,${ticketData.qrCode}`;
    } else if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas");
      if (canvas) qrDataUrl = canvas.toDataURL();
    }
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("E-Ticket", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Event: ${event.name}`, 20, 40);
    doc.text(`Date: ${event.startDate}`, 20, 48);
    doc.text(`Venue: ${event.venue?.name || "N/A"}`, 20, 56);
    doc.text(`City: ${event.venue?.city || "N/A"}`, 20, 64);

    let yPos = 72;
    doc.text("Seats:", 20, yPos);
    selectedSeats?.forEach((s, i) => {
      yPos += 8;
      doc.text(`- ${s.seatNumber} (${s.seatType}): Rs.${s.price}`, 30, yPos);
    });

    doc.text(`Total Paid: Rs.${finalPrice}`, 20, yPos + 12);

    if (qrDataUrl) doc.addImage(qrDataUrl, "PNG", 140, 40, 50, 50);
    doc.save("ticket.pdf");
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">No booking details found.</p>
      </div>
    );
  }
  const eventDateTime = event.startDate && event.startTime
    ? `${event.startDate}T${event.startTime}`
    : null;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle className="mx-auto h-20 w-20 text-green-600 mb-2" />
        <h1 className="text-4xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600 mt-2">Your tickets have been successfully booked</p>
      </motion.div>

      {/* Ticket Layout */}
      <motion.div
        className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* LEFT: Ticket Card */}
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-600 overflow-hidden">
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} /> <span>{eventDateTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} /> <span>{event.venue?.name || "N/A"}, {event.venue?.city || "N/A"}</span>
            </div>

            {/* Seats Table */}
            <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
              {selectedSeats?.map((seat, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                  <span className="font-medium">{seat.seatNumber} ({seat.seatType})</span>
                  <span className="font-semibold text-gray-800">Rs.{seat.price}</span>
                </div>
              ))}
            </div>

            <div style={{ color: colors.primary }} className="flex justify-between mt-4 font-bold text-lg">
              <span>Total Paid</span>
              <span>Rs.{finalPrice}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: QR + Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Tag size={18} /> Your E-Ticket QR
          </h3>
          <div ref={qrRef} className="p-4 bg-gray-50 rounded-lg">
            {ticketData?.qrCode ? (
              <img
                src={`data:image/png;base64,${ticketData.qrCode}`}
                alt="Ticket QR Code"
                className="w-44 h-44"
              />
            ) : (
              <QRCodeCanvas
                value={JSON.stringify({ eventId: event.id, seats: selectedSeats, finalPrice })}
                size={180}
              />
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Show this QR code at the event entrance
          </p>

          <button
            onClick={downloadTicket}
            style={{ backgroundColor: colors.primary }}
            className="w-full text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={16} /> Download Ticket
          </button>



          <Link
            to="/events"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold block text-center"
          >
            Browse More Events
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
