import React from "react";
import colors from "../../constants/colors";

// Example KPI Data (replace with real API data later)
const kpis = {
  totalEvents: 12,
  ticketsSold: 542,
  revenue: "LKR 120,500",
  nextEvent: "Music Fest - 3 days left",
};

// Example Upcoming Events Data
const upcomingEvents = [
  {
    id: 1,
    name: "Music Fest 2025",
    date: "Aug 30, 2025",
    venue: "Colombo Stadium",
    sold: 324,
    capacity: 400,
  },
  {
    id: 2,
    name: "Tech Conference",
    date: "Sep 15, 2025",
    venue: "BMICH, Colombo",
    sold: 180,
    capacity: 250,
  },
  {
    id: 3,
    name: "Charity Gala Dinner",
    date: "Oct 02, 2025",
    venue: "Hilton Colombo",
    sold: 90,
    capacity: 100,
  },
];

const Dashboard = () => {
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
            {kpis.totalEvents}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Tickets Sold</h3>
          <p className="text-xl font-bold" style={{ color: colors.primary }}>
            {kpis.ticketsSold}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-xl font-bold" style={{ color: colors.primary }}>
            {kpis.revenue}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 text-center">
          <h3 className="text-lg font-semibold">Upcoming Event</h3>
          <p className="text-lg font-bold" style={{ color: colors.primary }}>
            {kpis.nextEvent}
          </p>
        </div>
      </div>

      {/* Visual Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Chart</h3>
          <div className="h-40 flex items-center justify-center text-gray-400">
            📊 Chart goes here
          </div>
        </div>

        {/* Revenue Graph Placeholder */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Graph</h3>
          <div className="h-40 flex items-center justify-center text-gray-400">
            💹 Graph goes here
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const percentage = (event.sold / event.capacity) * 100;
            return (
              <div
                key={event.id}
                className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Event Info */}
                <div>
                  <h4 className="text-md font-bold">{event.name}</h4>
                  <p className="text-sm text-gray-600">
                    {event.date} • {event.venue}
                  </p>
                  {/* Progress Bar */}
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
                    {event.sold}/{event.capacity} tickets sold
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="px-3 py-1 rounded-lg text-white text-sm" style={{ backgroundColor: colors.primary }}>
                    Edit
                  </button>
                  <button className="px-3 py-1 rounded-lg border text-sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                    View Attendees
                  </button>
                  <button className="px-3 py-1 rounded-lg text-white text-sm bg-red-500">
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
