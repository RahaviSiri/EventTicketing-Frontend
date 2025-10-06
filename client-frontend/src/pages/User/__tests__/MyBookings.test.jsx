import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyBookings from "../MyBookings";
import { AppContext } from "../../../context/AppContext";
import { HeaderContext } from "../../../context/HeaderContext";

beforeAll(() => {
    window.scrollTo = jest.fn(); // mocks scrollTo so tests don’t break
});

describe("MyBookings Component", () => {
    // ✅ Define mockApi before using it
    const mockApi = {
        getOrdersByUser: jest.fn(),
        getAllEvents: jest.fn(),
        getTicketById: jest.fn(),
    };

    const renderComponent = (userID = "user123") =>
        render(
            <AppContext.Provider value={{ userID, orderServiceURL: "mockURL" }}>
                <HeaderContext.Provider value={{ api: mockApi }}>
                    <MyBookings />
                </HeaderContext.Provider>
            </AppContext.Provider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders fallback when no bookings", async () => {
        mockApi.getOrdersByUser.mockResolvedValueOnce({
            content: [],
            totalPages: 0,
        });
        mockApi.getAllEvents.mockResolvedValueOnce({ content: [] });

        renderComponent();

        expect(
            await screen.findByText(/You have no bookings yet/i)
        ).toBeInTheDocument();
    });

    it("renders bookings with ticket info", async () => {
        const mockBooking = {
            id: "b1",
            eventId: "e1",
            attendeeName: "John Doe",
            attendeeEmail: "john@example.com",
            ticketId: "t1",
            price: 100,
            status: "CONFIRMED",
            checkIn: true,
        };

        const mockEvent = { id: "e1", name: "Concert" };
        const mockTicket = { seatNumbers: "S1,S2" };

        mockApi.getOrdersByUser.mockResolvedValueOnce({
            content: [mockBooking],
            totalPages: 1,
        });
        mockApi.getAllEvents.mockResolvedValueOnce({ content: [mockEvent] });
        mockApi.getTicketById.mockResolvedValueOnce(mockTicket);

        renderComponent();

        expect(await screen.findByText(/Concert/i)).toBeInTheDocument();
        expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
        expect(await screen.findByText(/john@example.com/i)).toBeInTheDocument();
        expect(await screen.findByText(/Seats: S1,S2/i)).toBeInTheDocument();
        expect(await screen.findByText(/\$100/i)).toBeInTheDocument();
        expect(await screen.findByText(/CONFIRMED/i)).toBeInTheDocument();
        expect(await screen.findByText(/Checked In/i)).toBeInTheDocument();
    });

    it("handles pagination buttons", async () => {
        const mockBooking = {
            id: "b1",
            eventId: "e1",
            attendeeName: "John Doe",
            attendeeEmail: "john@example.com",
            ticketId: "t1",
            price: 100,
            status: "CONFIRMED",
            checkIn: true,
        };

        mockApi.getOrdersByUser.mockResolvedValueOnce({
            content: [mockBooking],
            totalPages: 2, // ✅ more than 1 page
        });
        mockApi.getAllEvents.mockResolvedValueOnce({ content: [] });
        mockApi.getTicketById.mockResolvedValueOnce({ seatNumbers: "S1" });

        renderComponent();

        const nextButton = await screen.findByText(/Next/i);
        const prevButton = screen.getByText(/Previous/i);

        // ✅ wait for buttons to reflect updated totalPages
        await waitFor(() => {
            expect(prevButton).toBeDisabled();
            expect(nextButton).not.toBeDisabled();
        });

        // Click Next page
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockApi.getOrdersByUser).toHaveBeenCalledTimes(2); // initial + after click
        });
    });
});
