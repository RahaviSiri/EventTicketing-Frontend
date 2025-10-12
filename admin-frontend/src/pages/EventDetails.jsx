// ✅ Only 3 key updates made
// 1️⃣ Changed API call URL to match backend route pattern `/events/{id}`
// 2️⃣ Used the actual eventId format (remove “EVT###” prefix parsing from navigate links)
// 3️⃣ Added backend field handling: event.organizerName / organizerEmail display

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Tag,
  FileText,
  Mail,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api/admin";

export default function EventDetails() {
  const { eventId } = useParams(); // e.g., 8
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("AdminToken");
        if (!token) {
          alert("Session expired. Please log in again.");
          window.location.href = "/admin-login";
          return;
        }

        // ✅ Correct API endpoint (matches backend)
        const numericId = eventId.replace(/\D/g, ""); // convert EVT006 → 6

        const response = await axios.get(
          `${API_BASE_URL}/events/${numericId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Event Details:", response.data);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
        if (error.response?.status === 404) {
          alert("Event not found.");
          navigate("/users");
        } else if (error.response?.status === 401) {
          alert("Unauthorized — please log in again.");
          window.location.href = "/admin-login";
        } else {
          alert("Error loading event details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate]);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="border-gray-300 text-gray-700">{status}</Badge>
        );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading event details...
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Event not found</p>
            <Button onClick={() => navigate("/users")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to User Management
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Management
          </Button>
          {getStatusBadge(event.status)}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {event.eventName}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag className="h-4 w-4" />
                  <span>{event.category}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <FileText className="h-5 w-5" />
                <span>Description</span>
              </div>
              <p className="text-gray-600 leading-relaxed pl-7">
                {event.description}
              </p>
            </div>

            {/* Event Info */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <MapPin className="h-5 w-5" />
                  <span>Venue</span>
                </div>
                <p className="text-gray-600 pl-7">{event.venueName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <User className="h-5 w-5" />
                  <span>Organizer</span>
                </div>
                <p className="text-gray-600 pl-7">
                  #{event.organizerId} — {event.organizerName}
                </p>
                <p className="text-gray-500 pl-7 flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {event.organizerEmail}
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Calendar className="h-5 w-5" />
                  <span>Start Date & Time</span>
                </div>
                <p className="text-gray-600 pl-7">
                  {new Date(event.startDate).toLocaleDateString("en-US")}
                </p>
                <p className="text-gray-600 pl-7 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {event.startTime}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Calendar className="h-5 w-5" />
                  <span>End Date & Time</span>
                </div>
                <p className="text-gray-600 pl-7">
                  {new Date(event.endDate).toLocaleDateString("en-US")}
                </p>
                <p className="text-gray-600 pl-7 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {event.endTime}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div>
                  <span className="font-semibold">Event ID:</span> {event.id}
                </div>
                <div>
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(event.createdAt).toLocaleDateString("en-US")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
