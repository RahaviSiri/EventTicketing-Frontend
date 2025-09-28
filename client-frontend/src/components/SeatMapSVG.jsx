import React from 'react';

const SeatMapSVG = ({ seats, selected, onToggle }) => (
  <svg width="300" height="200">
    {seats.map(seat => (
      <g key={seat.seatId} onClick={() => !seat.booked && onToggle(seat.seatId)}>
        <rect
          x={seat.x}
          y={seat.y}
          width="40"
          height="40"
          rx="6"
          fill={
            seat.booked ? '#f87171' :
            selected.includes(seat.seatId) ? '#4ade80' : '#e5e7eb'
          }
          stroke="#000"
        />
        <text x={seat.x + 20} y={seat.y + 25} textAnchor="middle" fontSize="14">
          {seat.seatId}
        </text>
      </g>
    ))}
  </svg>
);

export default SeatMapSVG;
