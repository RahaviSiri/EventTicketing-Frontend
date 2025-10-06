
describe("Organizer System Test", () => {
    const email = "rahavi24siri@gmail.com";
    const password = "12345";
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWhhdmkyNHNpcmlAZ21haWwuY29tIiwiaWF0IjoxNzU5Nzc2MDU3LCJleHAiOjE3NTk4NjI0NTd9.bVjmcFz1coxAhb-mOsIj1puhKPw1SjeXsOARRzj-AXc";

    beforeEach(() => {
        cy.visit("/login");
        cy.get("input[name='email']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.url({ timeout: 10000 }).should("not.include", "/login");
    });

    it("Dashboard displays correct stats", () => {
        cy.visit("/organizers/home");

        // Wait for events to load and KPIs to render
        cy.get("[data-testid='total-events']", { timeout: 10000 }).should("exist");
        cy.get("[data-testid='tickets-sold']", { timeout: 10000 }).should("exist");
        cy.get("[data-testid='revenue']", { timeout: 10000 }).should("exist");
        cy.get("[data-testid='upcoming-event']", { timeout: 10000 }).should("exist");
    });

    it("AddEvent creates a new event via form", () => {
        cy.visit("/organizers/addEvent");

        cy.get("input[name='organizerId']").clear().type("8");
        cy.get("input[name='name']").type("Cypress Test Event");
        cy.get("textarea[name='description']").type("Testing event creation");
        cy.get("input[name='venue.name']").type("Test Venue");
        cy.get("input[name='venue.city']").type("Colombo");
        cy.get("input[name='venue.capacity']").clear().type("100");
        cy.get("select[name='category']").select("Conference");

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

        cy.contains("Delete").click();
        cy.contains("Cypress Test Event").should("not.exist");
    });

});
