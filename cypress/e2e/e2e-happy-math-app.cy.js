describe('random math app', () => {
  it('can make calculations', () => {
    // Open the app
    cy.visit('/');

    // Alias the first and second numbers using XPath
    cy.xpath('/html/body/app-root/div/div/mat-card/mat-card-content/div/div[1]/div/span')
      .as('first-value');
    cy.xpath('/html/body/app-root/div/div/mat-card/mat-card-content/div/div[2]/div[2]/span')
      .as('second-value');

    // Extract both values and calculate the total
    cy.get('@first-value').invoke('text').then(firstText => {
      cy.get('@second-value').invoke('text').then(secondText => {
        const first = parseInt(firstText.trim());
        const second = parseInt(secondText.trim());
        const total = first + second;

        // Print message with values to the Cypress Command Log in the Test Runner panel
        cy.log(`First: ${first}, Second: ${second}, Total: ${total}`);

        // Force typing into the number input (bypass overlap issue)
        cy.get('input[type="number"]')
          //.clear({ force: true })   // Clear any existing value
          .type(`${total}`, { force: true });  // Enter the sum

        // Click the "Answer" button once enabled
        cy.contains('button', 'Answer')
          .should('not.be.disabled')
          .click();

        // Verify that the "That's right. Try another" window opens
        cy.get('#toast-container')
          .should('be.visible')
          .should('contain.text', "That's right");


        // Verify the "That's right. Try another" window is closed after 6 seconds
        cy.get('#toast-container', { timeout: 6000 }).should('not.be.visible');

        // Verify the number input field is cleared and ready for the next entry
        cy.get('input[type="number"]').should('have.value', '');

      });
    });
  });
});
