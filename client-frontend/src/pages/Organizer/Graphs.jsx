import React from "react";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const Graphs = ({ events }) => {
  const revenueData = events.map((item) => ({
    name: item.event.name,
    revenue: item.revenue || 0,
  }));

  return (
    <div className="w-full">
      <div className="">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          📊 Revenue by Event
        </h3>
        <div className="w-full h-[400px]"> {/* ensure proper height/width */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 13, fill: "#374151" }}
                height={70}
              />
              <YAxis
                tick={{ fontSize: 13, fill: "#374151" }}
                label={{
                  value: "Revenue ($)",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: "#374151",
                    fontSize: 14,
                  },
                }}
              />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
                contentStyle={{
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Bar
                dataKey="revenue"
                radius={[10, 10, 0, 0]}
                fill="#3b82f6" // blue
                barSize={45}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
