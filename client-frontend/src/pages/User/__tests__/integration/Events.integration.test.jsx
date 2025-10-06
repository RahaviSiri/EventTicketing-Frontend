import { render, screen, waitFor } from "@testing-library/react";
import Events from "../../Events";
import { AppContext } from "../../../../context/AppContext";
import { HeaderContext } from "../../../../context/HeaderContext";
import { MemoryRouter } from "react-router-dom";

beforeAll(() => {
    window.scrollTo = jest.fn(); // mock scroll
});

test("renders events fetched from API", async () => {
    const fakeAPI = {
        getAllEvents: async () => ({
            content: [{ id: 1, name: "Concert" }],
            totalPages: 1,
        }),
    };

    render(
        <MemoryRouter>
            <AppContext.Provider value={{ token: "fakeToken" }}>
                <HeaderContext.Provider value={{ api: fakeAPI }}>
                    <Events />
                </HeaderContext.Provider>
            </AppContext.Provider>
        </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Concert"));
    expect(screen.getByText("Concert")).toBeInTheDocument();
});

// Testing: "Does the component show event names returned by the API?"