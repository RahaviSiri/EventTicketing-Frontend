import React from 'react';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSeatMap, bookTicket } from '../../mock/mockApi';
import SeatMapSVG from '../../components/SeatMapSVG';

const SeatSelection = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', email: '' });
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    getSeatMap(id).then(setSeats);
  }, [id]);

  const toggleSeat = (seatId) => {
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleSubmit = async () => {
    await bookTicket({ ...form, eventId: id, selectedSeats: selected });
    alert("Booking Confirmed!");
  };

  return (
    <div>
      <input placeholder="Name" name="name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" name="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <SeatMapSVG seats={seats} selected={selected} onToggle={toggleSeat} />
      <button onClick={handleSubmit}>Confirm Booking</button>
    </div>
  );
};

export default SeatSelection;
