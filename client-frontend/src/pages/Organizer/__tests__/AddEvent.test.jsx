import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddEvent from "../AddEvent";
import { AppContext } from "../../../context/AppContext";
import { HeaderContext } from "../../../context/HeaderContext";

// Mock navigate
const mockNavigate = jest.fn();

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({}), // default: add mode
}));

// Mock URL.createObjectURL
beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mocked-url");
});

afterEach(() => {
    jest.clearAllMocks();
});

// Helper to render AddEvent with context
const renderAddEvent = (contextValue = {}) => {
    const defaultApi = {
        getEventById: jest.fn().mockResolvedValue({
            name: "",
            description: "",
            category: "",
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
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
        }),
        createOrUpdateEvent: jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
    };

    return render(
        <AppContext.Provider value={{ userID: 123, ...contextValue.app }}>
            <HeaderContext.Provider value={{ api: contextValue.api || defaultApi }}>
                <MemoryRouter>
                    <AddEvent />
                </MemoryRouter>
            </HeaderContext.Provider>
        </AppContext.Provider>
    );
};

describe("AddEvent Page", () => {
    it("renders all form fields", () => {
        renderAddEvent();

        expect(screen.getByLabelText(/Organizer ID/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Event Image/i)).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/City/i)[0]).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText(/Province/i)[0]).toBeInTheDocument();

        expect(screen.getByLabelText(/Venue Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Postal Code/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Country/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Capacity/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Venue Description/i)).toBeInTheDocument();
    });

    it("updates image preview when a file is selected", () => {
        renderAddEvent();

        const file = new File(["dummy content"], "example.png", { type: "image/png" });
        const input = screen.getByLabelText(/Event Image/i);

        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.getByAltText("Preview")).toBeInTheDocument();
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    it("submits form and navigates on success", async () => {
        // Remove jest.setTimeout(10000); - It's generally better to fix the root cause.

        const mockApi = {
            createOrUpdateEvent: jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ id: 1, name: "Test Event" }),
            }),
        };

        renderAddEvent({ api: mockApi });

        // Fill in event details
        fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: "Test Event" } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Test Desc" } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "Conference" } });

        fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: "2025-10-06" } });
        fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: "10:00" } });
        fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: "2025-10-06" } });
        fireEvent.change(screen.getByLabelText(/End Time/i), { target: { value: "12:00" } });

        // Fill in venue details
        fireEvent.change(screen.getByLabelText(/Venue Name/i), { target: { value: "Hall A" } });
        fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Street" } });
        fireEvent.change(screen.getByTestId("venue-city"), { target: { value: "CityX" } });
        fireEvent.change(screen.getAllByPlaceholderText(/Province/i)[0], { target: { value: "StateY" } }); // Used getAllByPlaceholderText to be safe
        fireEvent.change(screen.getByPlaceholderText(/Postal Code/i), { target: { value: "12345" } });
        fireEvent.change(screen.getByPlaceholderText(/Country/i), { target: { value: "CountryZ" } });
        fireEvent.change(screen.getByPlaceholderText(/Capacity/i), { target: { value: "100" } });
        fireEvent.change(screen.getByPlaceholderText(/Venue Description/i), { target: { value: "Nice hall" } });

        // Submit the form
        fireEvent.click(screen.getByText(/Add Event/i));

        // Wait for the API call to resolve
        await waitFor(() => {
            // console.log("Waiting for createOrUpdateEvent to be called"); // This log is no longer necessary
            expect(mockApi.createOrUpdateEvent).toHaveBeenCalled();
        }, { timeout: 3000 }); // Increase timeout if necessary, but 1-2s is usually fine.

        expect(mockNavigate).toHaveBeenCalledWith("/organizers/designLayout", expect.any(Object));
    }, 10000); // Set a test-specific timeout as a fallback



    it("fetches event details in edit mode", async () => {
        // Override useParams to simulate edit mode
        jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({ id: "42" });

        const mockApi = {
            getEventById: jest.fn().mockResolvedValue({
                name: "Existing Event",
                description: "Desc",
                category: "Workshop",
                startDate: "2025-10-06",
                startTime: "10:00",
                endDate: "2025-10-06",
                endTime: "12:00",
                venue: {
                    name: "Hall A",
                    address: "123 Street",
                    city: "CityX",
                    state: "StateY",
                    postalCode: "0000",
                    country: "CountryZ",
                    capacity: 100,
                    description: "Nice hall",
                },
            }),
            createOrUpdateEvent: jest.fn(),
        };

        renderAddEvent({ api: mockApi });

        // Wait for the event details to be fetched
        await waitFor(() => expect(mockApi.getEventById).toHaveBeenCalled());

        // Ensure the fetched details are rendered in the form
        await waitFor(() => expect(screen.getByDisplayValue("Existing Event")).toBeInTheDocument());
        await waitFor(() => expect(screen.getByDisplayValue("Desc")).toBeInTheDocument());
        await waitFor(() => expect(screen.getByDisplayValue("Workshop")).toBeInTheDocument());
        await waitFor(() => expect(screen.getByDisplayValue("Hall A")).toBeInTheDocument());
    });

    it("clears form when 'Clear' button is clicked", () => {
        renderAddEvent();

        const nameInput = screen.getByLabelText(/Event Name/i);
        fireEvent.change(nameInput, { target: { value: "Some Name" } });

        fireEvent.click(screen.getByText(/Clear/i));

        expect(nameInput.value).toBe("");
    });
});
