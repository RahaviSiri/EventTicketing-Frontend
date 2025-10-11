import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventsList from '../EventsList';
import { AppContext } from '../../../context/AppContext';
import { HeaderContext } from '../../../context/HeaderContext';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => {
    window.scrollTo = jest.fn();
});

// Mock react-router navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock API
const mockApi = {
    getEventsByOrganizerForPage: jest.fn(),
    deleteEvent: jest.fn(),
};

// Helper to render with context
const renderComponent = () => {
    return render(
        <BrowserRouter>
            <AppContext.Provider value={{ userID: '1' }}>
                <HeaderContext.Provider value={{ api: mockApi }}>
                    <EventsList />
                </HeaderContext.Provider>
            </AppContext.Provider>
        </BrowserRouter>
    );
};

describe('EventsList Component', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockApi.getEventsByOrganizerForPage.mockResolvedValue({
            content: [
                {
                    event: {
                        id: 101,
                        name: 'Test Event',
                        description: 'Event Desc',
                        startDate: '2025-10-06T10:00:00',
                        endDate: '2025-10-07T18:00:00',
                        imageUrl: 'test.jpg',
                    },
                },
            ],
            page: { totalPages: 2, }
        });
        mockApi.deleteEvent.mockResolvedValue({});
    });

    it('renders and fetches events', async () => {
        renderComponent();

        expect(screen.getByText(/Page 1 of 0/i)).toBeInTheDocument();

        await waitFor(() =>
            expect(mockApi.getEventsByOrganizerForPage).toHaveBeenCalledWith(1, 0, 6)
        );

        await waitFor(() => {
            expect(screen.getByText('Test Event')).toBeInTheDocument();
            expect(screen.getByText('Event Desc')).toBeInTheDocument();
        });

    });

    it('filters events by search', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Event'));

        // simulate search input
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'NonExisting' } });

        expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
    });

    it('navigates to event details on card click', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Event'));

        fireEvent.click(screen.getByRole('img'));
        expect(mockNavigate).toHaveBeenCalledWith(
            '/organizers/eventDetails',
            expect.any(Object)
        );

    });

    it('updates page on pagination button click', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Event'));

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        // State update may be async
        await waitFor(() => expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument());
    });

    it('calls update when clicking Update in menu', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Event'));

        // open menu
        const settingsBtn = screen.getByLabelText('settings');
        fireEvent.click(settingsBtn);

        const updateItem = await screen.findByText('Update');
        fireEvent.click(updateItem);

        expect(mockNavigate).toHaveBeenCalledWith('/organizers/updateEvent/101');
    });

    it('calls delete when clicking Delete in menu', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Test Event'));

        // open menu
        const settingsBtn = screen.getByLabelText('settings');
        fireEvent.click(settingsBtn);

        const deleteItem = await screen.findByText('Delete');
        fireEvent.click(deleteItem);

        await waitFor(() =>
            expect(mockApi.deleteEvent).toHaveBeenCalledWith(101)
        );

        // event should be removed
        expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
    });
});
