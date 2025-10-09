// context/HeaderContext.jsx
import React, { createContext, useContext } from "react";
import { AppContext } from "./AppContext";

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const {
    eventServiceURL,
    userServiceURL,
    seatingServiceURL,
    discountServiceURL,
    paymentServiceURL,
    orderServiceURL,
    ticketServiceURL,
    userID,
    token,
  } = useContext(AppContext);

  // 🔑 Common headers with auth
  const getHeaders = (isJSON = true) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (isJSON) headers["Content-Type"] = "application/json";
    return headers;
  };

  // ✅ API methods grouped by service
  const api = {
    // ---------------- EVENTS ----------------
    getAllEvents: async (page = 0, size = 10) => {
      const res = await fetch(`${eventServiceURL}/paged?page=${page}&size=${size}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    getEventsByOrganizer: async (id) => {
      const res = await fetch(`${eventServiceURL}/organizer/${id}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    getEventsByOrganizerForPage: async (id, page = 0, size = 10) => {
      const res = await fetch(`${eventServiceURL}/organizer/${id}/paged?page=${page}&size=${size}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    getEventById: async (eventId) => {
      const res = await fetch(`${eventServiceURL}/${eventId}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    createOrUpdateEvent: async (eventId, formData, isEdit) => {
      return fetch(`${eventServiceURL}${isEdit ? `/${eventId}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: getHeaders(false), // no JSON headers for FormData
        body: formData,
      });
    },
    deleteEvent: async (eventId) => {
      return fetch(`${eventServiceURL}/${eventId}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });
    },

    // ---------------- USERS ----------------
    getUserById: async (id) => {
      const res = await fetch(`${userServiceURL}/${id}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },

    // ---------------- SEATING ----------------
    getSeatingByEvent: async (eventId) => {
      const res = await fetch(`${seatingServiceURL}/event/${eventId}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    saveSeatingLayout: async (eventId, layoutJson) => {
      return fetch(`${eventServiceURL}/${eventId}/saveLayout`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ eventId, layoutJson }),
      });
    },

    // ---------------- DISCOUNTS ----------------
    getDiscountsByEvent: async (eventId) => {
      const res = await fetch(`${discountServiceURL}/event/${eventId}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    createDiscount: async (eventId, discountPayload) => {
      return fetch(`${discountServiceURL}/event/${eventId}`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(discountPayload),
      });
    },
    createDiscountWithFile: async (eventId, formData) => {
      return fetch(`${discountServiceURL}/event/${eventId}/file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no JSON for FormData
        body: formData,
      });
    },
    deleteDiscount: async (discountId) => {
      return fetch(`${discountServiceURL}/${discountId}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });
    },

    // ---------------- PAYMENTS ----------------
    getPaymentsByEvent: async (eventId) => {
      const res = await fetch(`${paymentServiceURL}/event/${eventId}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    createPayment: async (paymentData) => {
      return fetch(`${paymentServiceURL}`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(paymentData),
      });
    },
    // ---------------- Orders ----------------
    getOrdersByEvent: async (eventId, page = 0, size = 10) => {
      const res = await fetch(`${orderServiceURL}/event/${eventId}?page=${page}&size=${size}`, {
        headers: getHeaders(false),
      });
      return res.json(); // will return a Page object
    },
    getOrdersByUserOnlyByPage: async (userId, page = 0, size = 10) => {
      const res = await fetch(`${orderServiceURL}/user/${userId}?page=${page}&size=${size}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    getOrdersByUser: async (userId, page = 0, size = 10, month, year) => {
      let url = `${orderServiceURL}/user/${userId}?page=${page}&size=${size}`;
      if (month !== undefined && year !== undefined) {
        url += `&month=${month}&year=${year}`; // JS months are 0-11
      }
      const res = await fetch(url, { headers: getHeaders(false) });
      return res.json();
    },

    // ---------------- Tickets ----------------
    getRevenueByEventIds: async (ids) => {
      const res = await fetch(`${ticketServiceURL}/getRevenueByEvents`, {
        method: "POST",
        headers: getHeaders(true), // JSON headers
        body: JSON.stringify(ids), // send raw array: [1,2,3]
      });
      return res.json();
    },

    getEventsCountByEventIds: async (ids) => {
      const res = await fetch(`${ticketServiceURL}/getTicketsByEvents`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(ids),
      });
      return res.json();
    },
    getRevenueByEvent: async (eventId) => {
      const res = await fetch(`${ticketServiceURL}/revenue/event/${eventId}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    getRevenueByEventForMonth: async (eventId, year) => {
      const res = await fetch(`${ticketServiceURL}/revenue/event/${eventId}/year/${year}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    countTicketsByEvent: async (eventId) => {
      const res = await fetch(`${ticketServiceURL}/count/${eventId}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
    getTicketById: async (id) => {
      const res = await fetch(`${ticketServiceURL}/${id}`, {
        headers: getHeaders(false),
      });
      return res.json();
    },
  };

  return (
    <HeaderContext.Provider value={{ api }}>{children}</HeaderContext.Provider>
  );
};
