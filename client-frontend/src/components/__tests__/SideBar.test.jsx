// src/components/__tests__/SideBar.test.jsx

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SideBar from "../SideBar";

// Utility: render with router
const renderSideBar = (initialPath = "/") =>
    render(
        <MemoryRouter initialEntries={[initialPath]}>
            <SideBar />
        </MemoryRouter>
    );

describe("SideBar", () => {
    // renders all sidebar nav items
    it("renders all sidebar nav items", () => {
        renderSideBar();

        const dashboard = screen.getAllByText("Dashboard")[0];
        const viewEvents = screen.getAllByText("View Events")[0];
        const viewDiscounts = screen.getAllByText("View Discounts")[0];
        const orders = screen.getAllByText("Orders")[0];
        const scanQR = screen.getAllByText("Scan QR")[0];

        expect(dashboard).toBeInTheDocument();
        expect(viewEvents).toBeInTheDocument();
        expect(viewDiscounts).toBeInTheDocument();
        expect(orders).toBeInTheDocument();
        expect(scanQR).toBeInTheDocument();
    });

    it("renders icons for each nav item", () => {
        const { container } = renderSideBar();

        // Query all SVGs in sidebar
        const icons = container.querySelectorAll("svg");
        expect(icons.length).toBeGreaterThanOrEqual(5);
    });

    it("applies active class when route matches", () => {
        renderSideBar("/organizers/viewEvent");

        const activeLink = screen.getAllByRole("link").find(link =>
            link.textContent.includes("View Events")
        );
        expect(activeLink).toHaveClass("bg-[#feb300]");
    });

    it("does not apply active class when route does not match", () => {
        renderSideBar("/organizers/home");

        const viewEventsLink = screen.getAllByRole("link").find(link =>
            link.textContent.includes("View Events")
        );
        expect(viewEventsLink).not.toHaveClass("bg-[#feb300]");
    });

});
