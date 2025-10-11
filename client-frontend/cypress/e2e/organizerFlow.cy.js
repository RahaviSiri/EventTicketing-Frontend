/// <reference types="cypress" />
describe("Organizer System Test", () => {
    const email = "rahavi24siri@gmail.com";
    const password = "123456";

    beforeEach(() => {
        cy.visit("/login");
        cy.get("input[name='email']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.url({ timeout: 10000 }).should("not.include", "/login");
    });

    it("Dashboard displays correct stats", () => {
        cy.visit("/organizers/home");
        cy.url({ timeout: 10000 }).should("include", "/organizers/home");

        // Wait for events to load and KPIs to render
        cy.get("[data-testid='total-events']", { timeout: 10000 }).should("exist");
        cy.get("[data-testid='tickets-sold']", { timeout: 10000 }).should("exist");
        cy.get("[data-testid='revenue']", { timeout: 10000 }).should("exist");
        cy.get("[data-testid='upcoming-event']", { timeout: 10000 }).should("exist");
    });

    it("AddEvent creates a new event via form", () => {
        cy.visit("/organizers/addEvent");

        // Event Details
        cy.get("input[name='organizerId']").clear().type("8");
        cy.get("input[name='name']").type("Cypress Test Event");
        cy.get("textarea[name='description']").type("Testing event creation");
        cy.get("input[name='startDate']").type("2025-12-01");
        cy.get("input[name='startTime']").type("10:00");
        cy.get("input[name='endDate']").type("2025-12-01");
        cy.get("input[name='endTime']").type("12:00");
        cy.get("select[name='category']").select("Conference");

        // Venue Details
        cy.get("input[name='venue.name']").type("Test Venue");
        cy.get("input[name='venue.address']").type("123 Cypress Street");
        cy.get("input[name='venue.city']").type("Colombo");
        cy.get("input[name='venue.state']").type("Western");
        cy.get("input[name='venue.postalCode']").type("00100");
        cy.get("input[name='venue.country']").type("Sri Lanka");
        cy.get("input[name='venue.capacity']").clear().type("100");
        cy.get("textarea[name='venue.description']").type("A large test venue for Cypress events.");


        cy.get("button[type='submit']").click();

        // Wait for navigation to seating designer
        cy.url({ timeout: 10000 }).should("include", "/organizers/designLayout");
        cy.get("[data-testid='seat-layout']", { timeout: 15000 }).should("exist");
    });

    it("EventsList displays and filters events", () => {
        cy.visit("/organizers/viewEvent");

        cy.get("input[placeholder='Search events...']", { timeout: 10000 })
            .type("Cypress Test Event");

        cy.contains("Cypress Test Event").should("exist");

        // Click the three-dot menu for the correct event card
        cy.contains("Cypress Test Event")
            .parents('.MuiCard-root') 
            .within(() => {
                cy.get('button[aria-label="settings"]').click();
            });

        cy.contains("Delete").click({ force: true });
        cy.contains("Cypress Test Event").should("not.exist");
    });

});
