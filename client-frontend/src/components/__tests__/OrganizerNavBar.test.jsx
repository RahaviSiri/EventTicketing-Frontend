import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OrganizerNavBar from "../OrganizersNavBar"
import { AppContext } from "../../context/AppContext";

// Mock colors (if needed)
jest.mock("../../constants/colors", () => ({
    primary: "#ff0000",
    accent: "#00ff00",
}));

describe("OrganizerNavBar", () => {
    const mockChangeUserRole = jest.fn();
    const renderNavBar = () =>
        render(
            <AppContext.Provider value={{ changeUserRole: mockChangeUserRole }}>
                <MemoryRouter>
                    <OrganizerNavBar />
                </MemoryRouter>
            </AppContext.Provider>
        );

    it("renders logo text", () => {
        renderNavBar();
        expect(screen.getAllByText("Event")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Ease")[0]).toBeInTheDocument();
    });


    it("shows Become User button", () => {
        renderNavBar();
        expect(screen.getByRole("button", { name: /Become User/i })).toBeInTheDocument();
    });

    it("calls changeUserRole when Become User is clicked", async () => {
        renderNavBar();
        const button = screen.getByRole("button", { name: /Become User/i });
        fireEvent.click(button);
        await waitFor(() => {
            expect(mockChangeUserRole).toHaveBeenCalledWith("ATTENDEE");
        });
    });

    it("opens and closes dropdown menu", () => {
        renderNavBar();

        // Initially menu should not exist
        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

        // Open menu
        const menuButton = screen.getAllByRole("button")[0]; // safer than {name: ""}
        fireEvent.click(menuButton);

        const dashboards = screen.getAllByText("Dashboard");
        expect(dashboards.length).toBeGreaterThan(0);

        // Close by clicking again
        fireEvent.click(menuButton);
        expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });


    it("renders logout button", () => {
        renderNavBar();
        expect(screen.getAllByText(/Logout/i)[0]).toBeInTheDocument();
    });

});
