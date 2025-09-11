import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import colors from "../../constants/colors"

const Charts = ({ events }) => {
  // Prepare data for Sales Chart
  const salesData = events.map((item) => ({
    name: item.event.name,
    ticketsSold: item.ticketsSold || 0,
  }));

  return (
    <div className="w-full">
      {/* Tickets Sold Chart */}
      <div className="">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          🎟️ Tickets Sold
        </h3>
        <div className="w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={salesData}
              margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12, fill: "#374151" }}
                height={70}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#374151" }}
                label={{
                  value: "Tickets Sold",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: "#374151",
                    fontSize: 13,
                  },
                }}
              />
              <Tooltip
                formatter={(value) => `${value.toLocaleString()} tickets`}
                contentStyle={{ borderRadius: "10px" }}
              />
              <Line
                type="monotone"
                dataKey="ticketsSold"
                stroke= {colors.primary}
                strokeWidth={3}
                dot={{ r: 5, fill: colors.primary}}
                activeDot={{
                  r: 7,
                  fill: colors.primary,
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

};

export default Charts;
