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
const Graphs = ({ events }) => {

  // Prepare data for Revenue Graph
  const revenueData = events.map((item) => ({
    name: item.event.name,
    revenue: item.revenue || 0, // Replace with actual field from backend
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Graph */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Revenue</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphs;
