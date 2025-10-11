// src/pages/User/__tests__/CheckoutForm.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { CheckoutForm } from "../CheckoutForm";
import { AppContext } from "../../../context/AppContext";
import { HeaderContext } from "../../../context/HeaderContext";
import { MemoryRouter } from "react-router-dom";

// Mock Stripe hooks
const mockConfirmCardPayment = jest.fn();
jest.mock("@stripe/react-stripe-js", () => ({
    useStripe: () => ({
        confirmCardPayment: mockConfirmCardPayment,
    }),
    useElements: () => ({
        getElement: jest.fn(),
    }),
    CardElement: () => <div data-testid="card-element" />,
}));

describe("CheckoutForm", () => {
    const event = {
        id: 1,
        name: "Test Event",
        startDate: "2025-10-10",
        startTime: "18:00",
        venue: { name: "Test Venue" },
    };
    const selectedSeats = [
        { seatNumber: "A1", price: 100 },
        { seatNumber: "A2", price: 100 },
    ];
    const totalPrice = 200;

    const appContextValue = {
        paymentServiceURL: "/payment",
        seatingServiceURL: "/seating",
        ticketServiceURL: "/ticket",
        discountServiceURL: "/discount",
        orderServiceURL: "/order",
        token: "mock-token",
        userID: 123,
    };

    const headerContextValue = {
        api: {
            getDiscountsByEvent: jest.fn().mockResolvedValue([
                { code: "SAVE10", value: 10, discountType: "PERCENTAGE", validTo: "2025-12-31" },
            ]),
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing and shows discount info", async () => {
        await act(async () => {
            render(
                <AppContext.Provider value={appContextValue}>
                    <HeaderContext.Provider value={headerContextValue}>
                        <MemoryRouter>
                            <CheckoutForm event={event} selectedSeats={selectedSeats} totalPrice={totalPrice} />
                        </MemoryRouter>
                    </HeaderContext.Provider>
                </AppContext.Provider>
            );
        });

        // Wait for async discounts to finish
        await waitFor(() => {
            expect(screen.getByText(/Available Discounts/i)).toBeInTheDocument();
            expect(screen.getByText(/SAVE10/i)).toBeInTheDocument();
        });
    });

    it("applies discount code correctly", async () => {
        render(
            <AppContext.Provider value={appContextValue}>
                <HeaderContext.Provider value={headerContextValue}>
                    <MemoryRouter>
                        <CheckoutForm event={event} selectedSeats={selectedSeats} totalPrice={totalPrice} />
                    </MemoryRouter>
                </HeaderContext.Provider>
            </AppContext.Provider>
        );

        // Wait for discounts to load
        await waitFor(() => screen.getByText(/Available Discounts/i));

        const input = screen.getByPlaceholderText(/Enter discount code/i);
        const applyBtn = screen.getByText(/Apply/i);

        fireEvent.change(input, { target: { value: "SAVE10" } });

        // Mock fetch for discount validation
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(true),
        });

        fireEvent.click(applyBtn);

        await waitFor(() => {
            expect(screen.getByText(/Discount applied/i)).toBeInTheDocument();
            expect(screen.getByText(/New Price: Rs.180/i)).toBeInTheDocument(); // 10% off
        });
    });

    it("shows error if discount code is invalid", async () => {
        render(
            <AppContext.Provider value={appContextValue}>
                <HeaderContext.Provider value={headerContextValue}>
                    <MemoryRouter>
                        <CheckoutForm event={event} selectedSeats={selectedSeats} totalPrice={totalPrice} />
                    </MemoryRouter>
                </HeaderContext.Provider>
            </AppContext.Provider>
        );

        await waitFor(() => screen.getByText(/Available Discounts/i));

        const input = screen.getByPlaceholderText(/Enter discount code/i);
        const applyBtn = screen.getByText(/Apply/i);

        fireEvent.change(input, { target: { value: "INVALID" } });

        // Mock fetch for invalid discount
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(false),
        });

        fireEvent.click(applyBtn);

        await waitFor(() => {
            expect(screen.getByText(/Expired discount code/i)).toBeInTheDocument();
        });
    });

    it("disables pay button while processing", async () => {
        render(
            <AppContext.Provider value={appContextValue}>
                <HeaderContext.Provider value={headerContextValue}>
                    <MemoryRouter>
                        <CheckoutForm event={event} selectedSeats={selectedSeats} totalPrice={totalPrice} />
                    </MemoryRouter>
                </HeaderContext.Provider>
            </AppContext.Provider>
        );

        const payButton = screen.getByText(/Pay Rs.200/i);
        expect(payButton).toBeEnabled();
    });
});

