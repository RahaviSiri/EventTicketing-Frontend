import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import colors from "../../constants/colors"
// import { useNavigate } from "react-router-dom";

const DiscountList = () => {
  const { eventServiceURL, discountServiceURL, token, userID } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [discounts, setDiscounts] = useState([]);
  // const navigate = useNavigate();

  // Fetch events for the organizer
  useEffect(() => {
    if (!userID) return;
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${eventServiceURL}/organizer/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, [userID, eventServiceURL, token]);

  // Fetch discounts for selected event
  useEffect(() => {
    if (!selectedEvent) return;
    const fetchDiscounts = async () => {
      try {
        const res = await fetch(`${discountServiceURL}/event/${selectedEvent}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDiscounts(data);
      } catch (err) {
        console.error("Error fetching discounts:", err);
      }
    };
    fetchDiscounts();
  }, [selectedEvent, discountServiceURL, token]);

  // Delete discount
  const handleDelete = async (id) => {
    try {
      await fetch(`${discountServiceURL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(discounts.filter((d) => d.id !== id));
      //   navigate("/organizers/discountsLists");
    } catch (err) {
      console.error("Error deleting discount:", err);
    }
  };

  return (
    <div className="p-4">
      {/* Heading & Subheading */}
      <h1 style={{ color: colors.primary }} className="text-2xl font-bold mb-1">Discounts Management</h1>
      <p className="text-gray-600 mb-4">
        Select an event to view and manage its discount codes.
      </p>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel sx={{
          color: "gray", // default
          "&.Mui-focused": {
            color: colors.primary, // label color when focused
          },
        }} id="event-select-label">Select Event</InputLabel>
        <Select
          labelId="event-select-label"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          sx={{
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.primary,
            },
          }}
        >
          {events.map((evt) => (
            <MenuItem key={evt.event.id} value={evt.event.id}>
              {evt.event.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {discounts.length === 0 ? (
        <Typography variant="body1">No discounts available for this event.</Typography>
      ) : (
        <Grid container spacing={2}>
          {discounts.map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card sx={{ backgroundColor: "#f5f5f5", position: "relative" }}>
                <CardMedia
                  component="img"
                  image={d.imageURL || "https://via.placeholder.com/300x140?text=No+Image"}
                  alt={d.code}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {d.code}
                  </Typography>
                  <Typography variant="body2">{d.description}</Typography>
                </CardContent>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(d.id)}
                  sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default DiscountList;
