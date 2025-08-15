import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get event ID from URL
  const isEditMode = Boolean(id); // Check if we are editing

  const [form, setForm] = useState({
    organizerId: 456,
    venue: {
      name: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      capacity: 0,
      description: "",
    },
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);

  // Fetch existing event details if editing
  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:8089/api/events/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch event details");
          return res.json();
        })
        .then((data) => {
          setForm({
            ...data,
            venue: data.venue || form.venue,
          });
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("venue.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        venue: { ...prev.venue, [key]: key === "capacity" ? Number(value) : value },
      }));
    } else if (name === "organizerId") {
      setForm((prev) => ({ ...prev, organizerId: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Backend_URL = `http://localhost:8089/api/events${isEditMode ? `/${id}` : ""}`;

    try {
      const formData = new FormData();
      formData.append("event", new Blob([JSON.stringify(form)], { type: "application/json" }));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(Backend_URL, {
        method: isEditMode ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Request failed (${res.status}): ${errText || res.statusText}`);
      }

      alert(`Event ${isEditMode ? "updated" : "created"} successfully!`);
      navigate("/organizers/viewEvent");
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEditMode ? "update" : "create"} event: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Create Event</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Event details */}
        <section className="space-y-4">
          <div className="rounded-2xl shadow p-4 sm:p-5">
            <h2 className="text-lg font-medium mb-4">Event Details</h2>
            <label className="block mb-3">
              <span className="block text-sm mb-1">Organizer ID</span>
              <input type="number" name="organizerId" value={form.organizerId} onChange={handleChange} className="w-full rounded-md border p-2" required />
            </label>
            <label className="block mb-3">
              <span className="block text-sm mb-1">Event Name</span>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full rounded-md border p-2" required />
            </label>
            <label className="block mb-3">
              <span className="block text-sm mb-1">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full rounded-md border p-2" rows={4} required />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm mb-1">Start Date</span>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full rounded-md border p-2" required />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Start Time</span>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="w-full rounded-md border p-2" step="1" required />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">End Date</span>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full rounded-md border p-2" required />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">End Time</span>
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="w-full rounded-md border p-2" step="1" required />
              </label>
            </div>
            <label className="block mt-3">
              <span className="block text-sm mb-1">Category</span>
              <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-md border p-2" required>
                <option value="">Select</option>
                <option>Conference</option>
                <option>Workshop</option>
                <option>Seminar</option>
                <option>Meetup</option>
                <option>Expo</option>
              </select>
            </label>
            {/* Image upload */}
            <label className="block mt-3">
              <span className="block text-sm mb-1">Event Image</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full rounded-md border p-2" />
              {imageFile ? (
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
              ) : form.imageUrl ? (
                <img src={form.imageUrl} alt="Current Event" className="mt-2 w-32 h-32 object-cover" />
              ) : null}
            </label>
          </div>
        </section>

        {/* Right column: Venue details */}
        <section className="space-y-4">
          <div className="rounded-2xl shadow p-4 sm:p-5">
            <h2 className="text-lg font-medium mb-4">Venue Details</h2>
            <label className="block mb-3">
              <span className="block text-sm mb-1">Venue Name</span>
              <input type="text" name="venue.name" value={form.venue.name} onChange={handleChange} className="w-full rounded-md border p-2" required />
            </label>
            <label className="block mb-3">
              <span className="block text-sm mb-1">Address</span>
              <input type="text" name="venue.address" value={form.venue.address} onChange={handleChange} className="w-full rounded-md border p-2" required />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="venue.city" value={form.venue.city} onChange={handleChange} placeholder="City" className="w-full rounded-md border p-2" required />
              <input type="text" name="venue.state" value={form.venue.state} onChange={handleChange} placeholder="State" className="w-full rounded-md border p-2" />
              <input type="text" name="venue.postalCode" value={form.venue.postalCode} onChange={handleChange} placeholder="Postal Code" className="w-full rounded-md border p-2" />
              <input type="text" name="venue.country" value={form.venue.country} onChange={handleChange} placeholder="Country" className="w-full rounded-md border p-2" />
              <input type="number" name="venue.capacity" value={form.venue.capacity} onChange={handleChange} placeholder="Capacity" className="w-full rounded-md border p-2" min={0} />
            </div>
            <textarea name="venue.description" value={form.venue.description} onChange={handleChange} placeholder="Venue Description" className="w-full rounded-md border p-2 mt-3" rows={3} />
          </div>
        </section>

        <div className="col-span-1 lg:col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => {
              setForm({
                organizerId: 456,
                venue: {
                  name: "",
                  address: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "",
                  capacity: 0,
                  description: "",
                },
                name: "",
                description: "",
                startDate: "",
                startTime: "",
                endDate: "",
                endTime: "",
                category: "",
              });
              setImageFile(null);
            }}
            className="px-4 py-2 rounded-md border hover:bg-gray-50"
          >
            Clear
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            {isEditMode ? "Update Event" : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
