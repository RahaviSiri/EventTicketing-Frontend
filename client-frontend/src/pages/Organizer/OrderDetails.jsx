import React, { useContext, useEffect, useState } from "react";
import colors from "../../constants/colors";
import { MdReceipt } from "react-icons/md";
import { HeaderContext } from "../../context/HeaderContext"
import { AppContext } from "../../context/AppContext";

const OrderDetails = () => {
  const [events, setEvents] = useState([]);
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

  const fetchOrders = async (eventID) => {
    if (!eventID) return;
    console.log(eventID);
    try {
      const res = await api.getOrdersByEvent(eventID);
      console.log("Response: ", res);
      if (Array.isArray(res)) {
        setOrders(res);
      } else {
        console.warn("Expected array but got:", res);
        setOrders([]);
      }
    } catch (error) {
      console.error(`Error fetching orders for event ID ${eventID}:`, error);
      setOrders([]);
    }
  };


  useEffect(() => {
    fetchEvents();
    // console.log(events);
  }, [api, userID])

  useEffect(() => {
    if (selectedEvent) {
      console.log(selectedEvent);
      fetchOrders(selectedEvent);
    }
  }, [selectedEvent]);

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
    </div>
  );
};

export default OrderDetails;
