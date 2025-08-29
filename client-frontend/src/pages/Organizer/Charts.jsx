import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Assume events is an array of objects with 'event.name', 'ticketsSold', and 'revenue'
const Charts = ({ events }) => {
  // Prepare data for Sales Chart
  const salesData = events.map((item) => ({
    name: item.event.name,
    ticketsSold: item.ticketsSold || 0, // Replace with actual field from backend
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tickets Sold</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ticketsSold" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
