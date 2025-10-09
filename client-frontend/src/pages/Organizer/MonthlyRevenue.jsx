import React from 'react';
import { Line } from 'react-chartjs-2';
import colors from "../../constants/colors";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const MonthlyRevenue = ({ annualRevenue }) => {
  // Chart data for Annual Revenue (for all 12 months)
  const chartData = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ], // Month names
    datasets: [
      {
        label: 'Monthly Revenue',
        data: annualRevenue.length === 12 ? annualRevenue : Array(12).fill(0), // Ensure there are always 12 months
        borderColor: colors.primary, // Use your primary color for the line
        backgroundColor: colors.primary + '33', // Lighten the color for the fill
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="mb-7">
      <h3 className="font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
      <div className="w-full sm:w-[90%] md:w-[80%] mx-auto" style={{ height: '300px', maxHeight: '400px' }}>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default MonthlyRevenue;
