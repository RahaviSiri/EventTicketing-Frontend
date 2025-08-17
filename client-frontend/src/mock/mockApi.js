// Simulate event and seat data
export const getEvents = () => Promise.resolve([
  { id: 1, title: "Tech Conference", date: "2025-09-10" },
  { id: 2, title: "Music Fest", date: "2025-09-15" }
]);

export const getEventDetails = (id) => Promise.resolve({
  id, title: `Event ${id}`, description: "Exciting event!", date: "2025-09-10"
});

export const getSeatMap = (eventId) => Promise.resolve([
  { seatId: "A1", x: 20, y: 20, booked: false },
  { seatId: "A2", x: 80, y: 20, booked: false },
  { seatId: "A3", x: 140, y: 20, booked: true },
  { seatId: "B1", x: 20, y: 80, booked: false },
  { seatId: "B2", x: 80, y: 80, booked: false },
  { seatId: "B3", x: 140, y: 80, booked: true },
]);

export const bookTicket = (data) => {
  console.log("Booking data:", data);
  return Promise.resolve({ status: "success", message: "Booking Confirmed" });
};
