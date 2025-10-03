import React, { useContext, useEffect, useState } from "react";
import { HeaderContext } from "../../context/HeaderContext";
import { AppContext } from "../../context/AppContext";
import {
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  TicketIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import colors from "../../constants/colors";

const MyBookings = () => {
  const { userID, orderServiceURL } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketMap, setTicketMap] = useState({});
  const { api } = useContext(HeaderContext);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch bookings
  useEffect(() => {
    if (!userID) return;
    const fetchBookings = async () => {
      try {
        const bookingsData = await api.getOrdersByUser(
          userID,
          currentPage,
          10,
          selectedMonth + 1,
          selectedYear
        );
        setBookings(bookingsData.content);
        setTotalPages(bookingsData.totalPages);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [api, userID, currentPage, selectedMonth, selectedYear]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await api.getAllEvents();
        setEvents(eventData.content);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [api]);

  // Fetch tickets for each booking
  useEffect(() => {
    const fetchTickets = async () => {
      const map = {};
      await Promise.all(
        bookings.map(async (booking) => {
          try {
            const ticketData = await api.getTicketById(booking.ticketId);
            console.log(
              "Fetched ticket data for booking",
              booking.id,
              ticketData
            );
            map[booking.id] = ticketData;
          } catch (error) {
            console.error(
              "Error fetching ticket for booking",
              booking.id,
              error
            );
          }
        })
      );
      setTicketMap(map);
    };

    if (bookings.length > 0) fetchTickets();
  }, [api, bookings]);

  const getEventName = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.name : "Unknown Event";
  };

  // Scroll to top when component mounts or page/month/year changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // optional, for smooth scroll
    });
  }, [currentPage, selectedMonth, selectedYear]);

  // console.log('Bookings:', bookings);
  // console.log('Ticket Map:', ticketMap);
  // console.log('Fetching bookings for', selectedMonth+1, selectedYear);
  // console.log('Fetching URL:', `${orderServiceURL}/user/${userID}?page=${currentPage}&size=10&month=${selectedMonth + 1}&year=${selectedYear}`);

  return (
    <div onload="window.scrollTo(0, 0)" className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8" style={{ color: colors.primary }}>
        My Bookings
      </h1>
      <div className="mb-4">
        <input
          type="month"
          value={`${selectedYear}-${String(selectedMonth + 1).padStart(
            2,
            "0"
          )}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split("-");
            setSelectedYear(Number(year));
            setSelectedMonth(Number(month) - 1);
          }}
          className="border rounded px-2 py-1"
        />
      </div>

      {bookings && bookings.length === 0 ? (
        <p className="text-gray-600 text-lg">You have no bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const ticket = ticketMap[booking.id]; // Ticket info for this booking
            return (
              <div
                key={booking.id}
                className="bg-white shadow-md rounded-lg hover:shadow-lg transition duration-200 border-l-4"
                style={{ borderColor: colors.primary + "99" }}
              >
                {/* Event Name */}
                <div className="bg-gray-200 p-4 rounded-t-lg">
                  <div className="flex items-center text-gray-800 font-semibold text-lg">
                    <CalendarIcon className="h-6 w-6 mr-2 text-gray-500" />
                    {getEventName(booking.eventId)}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-4 space-y-3">
                  {/* Attendee */}
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {booking.attendeeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 font-medium">
                      {booking.attendeeEmail}
                    </span>
                  </div>

                  {/* Ticket / Seat Info */}
                  {ticket && (
                    <div className="flex items-center gap-2">
                      <TicketIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-gray-700 font-medium">
                        Seats: {ticket.seatNumbers}
                      </span>
                    </div>
                  )}

                  {/* Price and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                      <span className="text-gray-700 font-medium">
                        ${booking.price}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded-full text-sm font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span>{booking.status}</span>
                    </div>
                  </div>

                  {/* Check-In Status */}
                  <div className="flex items-center gap-2">
                    {booking.checkIn ? (
                      <>
                        <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                        <span className="text-gray-700 font-medium">
                          Checked In
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-5 w-5 text-red-400" />
                        <span className="text-gray-700 font-medium">
                          Not Checked In
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2 mt-4">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={currentPage + 1 >= totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyBookings;
