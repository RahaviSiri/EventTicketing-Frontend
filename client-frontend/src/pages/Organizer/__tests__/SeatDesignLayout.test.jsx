// src/pages/Organizer/__tests__/SeatDesignLayout.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SeatDesignLayout from "../SeatDesignLayout";
import { AppContext } from "../../../context/AppContext";
import { HeaderContext } from "../../../context/HeaderContext";
import { BrowserRouter } from "react-router-dom";

beforeAll(() => {
  window.alert = jest.fn(); // mock alert
});

// --- Mock useNavigate & useLocation ---
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { event: { id: 1, venue: { capacity: 20 } } } }),
}));

// --- Full mock of Konva ---
jest.mock("konva", () => {
  class MockNode {
    constructor(props) { this.attrs = { ...props }; }
    setAttr(key, value) { this.attrs[key] = value; }
    getAttr(key) { return this.attrs[key]; }
    position(pos) { if(pos) { this.attrs.x = pos.x; this.attrs.y = pos.y; } return { x: this.attrs.x, y: this.attrs.y }; }
    x() { return this.attrs.x; }
    y() { return this.attrs.y; }
    fill() {}
    on() {}
  }
  return {
    Stage: jest.fn(() => ({
      add: jest.fn(),
      destroy: jest.fn(),
      width: jest.fn(),
      height: jest.fn(),
    })),
    Layer: jest.fn(() => ({
      add: jest.fn(),
      draw: jest.fn(),
      findOne: jest.fn(() => new MockNode({ seatNumber: "S1" })),
    })),
    Circle: MockNode,
    Rect: MockNode,
  };
});

describe("SeatDesignLayout Component", () => {
  let mockApi;

  beforeEach(() => {
    mockApi = {
      getSeatingByEvent: jest.fn().mockResolvedValue({ layoutJson: null }),
      saveSeatingLayout: jest.fn().mockResolvedValue({}),
    };
  });

  const renderComponent = (onSave = jest.fn()) =>
    render(
      <BrowserRouter>
        <AppContext.Provider value={{ token: "mockToken" }}>
          <HeaderContext.Provider value={{ api: mockApi }}>
            <SeatDesignLayout onSave={onSave} />
          </HeaderContext.Provider>
        </AppContext.Provider>
      </BrowserRouter>
    );

  it("renders the layout and inputs", async () => {
    renderComponent();

    expect(screen.getByText(/Design Seating Layout/i)).toBeInTheDocument();
    expect(screen.getByText(/Venue capacity: 20 seats/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockApi.getSeatingByEvent).toHaveBeenCalledWith(1);
    });

    expect(screen.getByLabelText(/Seat Shape/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of VIP Seats/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/VIP Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Regular Price/i)).toBeInTheDocument();
  });

  it("updates VIP/Regular seat count and prices", async () => {
    renderComponent();
    const vipInput = screen.getByLabelText(/Number of VIP Seats/i);
    fireEvent.change(vipInput, { target: { value: "5" } });
    expect(vipInput.value).toBe("5");

    const vipPriceInput = screen.getByLabelText(/VIP Price/i);
    fireEvent.change(vipPriceInput, { target: { value: "200" } });
    expect(vipPriceInput.value).toBe("200");

    const regularPriceInput = screen.getByLabelText(/Regular Price/i);
    fireEvent.change(regularPriceInput, { target: { value: "80" } });
    expect(regularPriceInput.value).toBe("80");
  });

  it("calls onSave and API when clicking Save Layout", async () => {
    const mockOnSave = jest.fn();
    renderComponent(mockOnSave);

    const saveButton = screen.getByText(/Save Layout/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockApi.saveSeatingLayout).toHaveBeenCalled();
      expect(mockOnSave).toHaveBeenCalled();
    });
  });
});
