import React, { useContext, useEffect, useState } from "react";
import colors from "../../constants/colors";
import { AppContext } from "../../context/AppContext";
import Charts from './Charts';
import Graphs from "./Graphs";

const Dashboard = () => {
  const { eventServiceURL, userID, token } = useContext(AppContext);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    if (!userID) return; // wait until userID is available
    const id = parseInt(userID, 10);
    try {
      const res = await fetch(`${eventServiceURL}/organizer/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();

      // Sort events by startDate (earliest first)
      const sortedEvents = [...data].sort(
        (a, b) => new Date(a.event.startDate) - new Date(b.event.startDate)
      );

      setEvents(sortedEvents);
      console.log("Fetched events:", sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userID, token]);

  // Earliest event for top card
  const earliestEvent = events.length > 0 ? events[0] : null;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Note Section */}
      <div
        className="rounded-2xl p-6 shadow-lg text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <h1 className="text-2xl font-bold">Welcome, Organizer 🎉</h1>
        <p className="mt-2 text-base">
          Manage your events, track bookings, and send reminders — all in one place.
        </p>
      </div>

      {/* Top Section: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Total Events</h3>
          <p className="text-xl font-bold" style={{ color: colors.primary }}>
            {events.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Tickets Sold</h3>
          <p className="text-xl font-bold" style={{ color: colors.primary }}>
            {0}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-xl font-bold" style={{ color: colors.primary }}>
            LKR 0
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Upcoming Event</h3>
          <p className="text-lg font-bold" style={{ color: colors.primary }}>
            {earliestEvent ? earliestEvent.event.name : "No events"}
          </p>
        </div>
      </div>

      {/* Visual Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Sales Chart</h3>
          <div className="grid grid-cols-1 gap-6">
             <Charts events={events} />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">💹 Revenue Graph</h3>
          <div className="grid grid-cols-1 gap-6">
            <Graphs events={events} />
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.slice(0, 5).map((item) => {
              const evt = item.event;
              const venue = item.venue;

              const sold = 0;
              const percentage = venue?.capacity
                ? (sold / venue.capacity) * 100
                : 0;

              return (
                <div
                  key={evt.id}
                  className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  {/* Event Info */}
                  <div>
                    <h4 className="text-md font-bold">{evt.name}</h4>
                    <p className="text-sm text-gray-600">
                      {evt.startDate} • {venue?.name}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors.primary,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1 text-gray-600">
                      {sold}/{venue?.capacity ?? 0} tickets sold
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded-lg border text-sm"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                      }}
                    >
                      View Attendees
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
