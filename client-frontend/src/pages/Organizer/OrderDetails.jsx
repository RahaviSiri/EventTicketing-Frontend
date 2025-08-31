import React, { useState } from "react";
import colors from "../../constants/colors";
import { MdReceipt } from "react-icons/md";

// Dummy events
const events = [
  { id: 1, name: "Music Fest 2025" },
  { id: 2, name: "Tech Conference 2025" },
  { id: 3, name: "Charity Gala Dinner" },
];

// Dummy orders (normally you’d fetch based on eventId)
const ordersData = {
  1: [
    { id: "ORD123", attendee: "John Doe", email: "john@example.com", ticket: "VIP", price: "LKR 5000", status: "Paid", date: "Aug 20, 2025", checkIn: true },
    { id: "ORD124", attendee: "Jane Smith", email: "jane@example.com", ticket: "Regular", price: "LKR 2000", status: "Pending", date: "Aug 21, 2025", checkIn: false },
  ],
  2: [
    { id: "ORD201", attendee: "Sam Perera", email: "sam@example.com", ticket: "Standard", price: "LKR 3000", status: "Paid", date: "Sep 01, 2025", checkIn: false },
  ],
  3: [
    { id: "ORD301", attendee: "Ravi Kumar", email: "ravi@example.com", ticket: "Donor", price: "LKR 10,000", status: "Paid", date: "Oct 01, 2025", checkIn: true },
  ],
};

const OrderDetails = () => {
  const [selectedEvent, setSelectedEvent] = useState(events[0].id);
  const orders = ordersData[selectedEvent] || [];

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
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Attendee</th>
              <th className="p-3">Email</th>
              <th className="p-3">Ticket</th>
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
                <td className="p-3">{order.attendee}</td>
                <td className="p-3">{order.email}</td>
                <td className="p-3">{order.ticket}</td>
                <td className="p-3">{order.price}</td>
                <td
                  className={`p-3 font-semibold ${order.status === "Paid" ? "text-green-600" : "text-yellow-600"
                    }`}
                >
                  {order.status}
                </td>
                <td className="p-3">{order.date}</td>
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
    </div>
  );
};

export default OrderDetails;
