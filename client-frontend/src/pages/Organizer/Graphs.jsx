import React, { useContext, useState, useEffect } from "react";
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { HeaderContext } from "../../context/HeaderContext";
import { AppContext } from "../../context/AppContext";
import colors from "../../constants/colors"

const Graphs = () => {
  const { api } = useContext(HeaderContext);
  const { userID } = useContext(AppContext);
  const [fetchedEvents, setFetchedEvents] = useState([]);

  useEffect(() => {
    const fetchEventsWithRevenue = async () => {
      if (!userID) return;

      try {
        const rawEvents = await api.getEventsByOrganizer(userID);

        const enriched = await Promise.all(
          rawEvents.map(async (item) => {
            const rev = await api.getRevenueByEvent(item.event.id);
            return { ...item, revenue: rev };
          })
        );

        setFetchedEvents(enriched);
      } catch (err) {
        console.error("Error fetching events with revenue:", err);
      }
    };

    fetchEventsWithRevenue();
  }, [userID, api]);

  const revenueData = fetchedEvents.map((item) => ({
    name: item.event.name,
    revenue: item.revenue || 0,
  }));

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        📊 Revenue by Event
      </h3>
      <div className="w-full h-[400px]">
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
              fill={colors.primary}
              barSize={45}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphs;
