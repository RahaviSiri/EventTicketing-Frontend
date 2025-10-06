import React, { useContext, useEffect, useState } from "react";
import colors from "../../constants/colors";
import { MdReceipt } from "react-icons/md";
import { HeaderContext } from "../../context/HeaderContext"
import { AppContext } from "../../context/AppContext";

const OrderDetails = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState("");
  const { api } = useContext(HeaderContext);
  const { userID } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  const fetchEvents = async () => {
    if (!userID) return;
    // console.log(userID);
    try {
      const data = await api.getEventsByOrganizer(userID);
      console.log(data);
      setEvents(data);
      if (data.length > 0) {
        setSelectedEvent(data[0].event.id);

      }
    } catch (error) {
      console.log("Error in fetching events" + error);
    }
  }

  const fetchOrders = async (eventID, page = 0) => {
    if (!eventID) return;
    try {
      const res = await api.getOrdersByEvent(eventID, page, size);
      if (res && Array.isArray(res.content)) {
        console.log("res");
        setOrders(res.content);
        setTotalPages(res.totalPages || 1);
      } else {
        // fallback if backend sends plain array
        console.log("ressss");
        setOrders(Array.isArray(res) ? res : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchEvents();
    // console.log(events);
  }, [api, userID])

  useEffect(() => {
    if (selectedEvent) {
      console.log(selectedEvent);
      fetchOrders(selectedEvent, page);
    }
  }, [selectedEvent, page]);

  // Function to download orders as CSV
  const downloadCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      "Order ID",
      "Attendee",
      "Email",
      "Ticket ID",
      "Price",
      "Status",
      "Date",
      "Check-In"
    ];

    const rows = orders.map(order => [
      order.id,
      order.attendeeName,
      order.attendeeEmail,
      order.ticketId,
      order.price,
      order.status,
      new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(order.createdAt)),
      order.checkIn ? "Checked-In" : "Not Checked-In"
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_event_${selectedEvent}_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      <div style={{ backgroundColor: colors.primary }} className="rounded-2xl p-6 shadow-lg text-white space-y-2">
        {/* Page Title */}
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MdReceipt size={24} />
          Order Details
        </h1>

        {/* Page Description */}
        <p className="text-base" >
          This page allows you to manage and review all ticket orders for your events.
          Select an event from the dropdown below to view its attendees, ticket types,
          payment statuses, and check-in details. Use this data to track sales, confirm
          payments, and monitor event participation in real time.
        </p>
      </div>

      {/* Dropdown to select event */}
      <div className="flex items-center gap-4">
        <label htmlFor="eventSelect" className="font-semibold">
          Select Event:
        </label>
        <select
          id="eventSelect"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(Number(e.target.value))}
          className="border rounded-lg p-2 outline-none focus:ring-2"
          style={{
            borderColor: colors.primary,
            focusBorderColor: colors.primary,
            boxShadow: `0 0 0 2px ${colors.primary}33`, // faint shadow when focused
          }}
        >
          {events.map((event) => (
            <option key={event.event.id} value={event.event.id}>
              {event.event.name}
            </option>
          ))}
        </select>

        {/* Download Button */}
        <button
          onClick={downloadCSV}
          style={{ backgroundColor: colors.primary }}
          className="px-4 py-2 rounded text-white hover:opacity-90"
        >
          Download CSV
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Attendee</th>
              <th className="p-3">Email</th>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Check-In</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-3">{order.id}</td>
                <td className="p-3">{order.attendeeName}</td>
                <td className="p-3">{order.attendeeEmail}</td>
                <td className="p-3">{order.ticketId}</td>
                <td className="p-3">{order.price}</td>
                <td
                  className={`p-3 font-semibold ${order.status === "Paid" ? "text-green-600" : "text-yellow-600"
                    }`}
                >
                  {order.status}
                </td>
                <td className="p-3">
                  {new Intl.DateTimeFormat("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(order.createdAt))}
                </td>

                <td className="p-3">
                  {order.checkIn ? (
                    <span className="text-green-600">✅ Checked-In</span>
                  ) : (
                    <span className="text-red-500">❌ Not Checked-In</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500 text-center" colSpan={8}>
                  No orders found for this event.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          style={{ backgroundColor: colors.primary }}
          className="px-4 py-2 rounded text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          style={{ backgroundColor: colors.primary }}
          className="px-4 py-2 rounded text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default OrderDetails;
