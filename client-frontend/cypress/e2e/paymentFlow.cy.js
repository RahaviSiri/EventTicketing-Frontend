/// <reference types="cypress" />
describe("Full Event Booking Flow", () => {
    const email = "rahavi24siri@gmail.com";
    const password = "12345";
    const eventId = 41;

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        Cypress.env('TEST_MODE', true); // Set test mode before each test
    });

    it("allows user to login, select seats, pay, and see success page", () => {
        // Step 1: Login
        cy.visit("/login");
        cy.get("input[name='email']").type(email);
        cy.get("input[name='password']").type(password);
        cy.get("button[type='submit']").click();
        cy.url({ timeout: 10000 }).should("not.include", "/login");

        // Step 2: Visit event page and open seat selection
        cy.visit(`/events/${eventId}`);
        cy.contains("Select Seats & Book Now").click();
        cy.url().should("include", `/events/${eventId}/seats`);

        // Step 3: Intercept reserve API
        const seatingServiceURL = "http://localhost:8080/api/seating-charts";
        cy.intercept("POST", `${seatingServiceURL}/${eventId}/reserve`).as("reserveSeats");

        // Step 4: Click a seat on canvas
        cy.window({ log: false })
            .its('stageRef', { timeout: 10000 })
            .should('exist')
            .then((stage) => {
                const layer = stage.getLayers()[0];
                const seat = layer.findOne('.seat-S2');
                seat.fire('click');
            });

        cy.wait(500);

        // Step 5: Confirm booking
        cy.contains("Confirm Booking").should('not.be.disabled').click();
        cy.wait("@reserveSeats").its("response.statusCode").should("eq", 200);

        cy.wait(500);

        // Step 6: Submit payment (Stripe mock in TEST_MODE)
        cy.get("button[type='submit']").click();

        // Step 7: Verify success page
        cy.url({ timeout: 10000 }).should("include", `/events/${eventId}/success`);
        cy.contains("Booking Confirmed").should("be.visible");
    });
});
