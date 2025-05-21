describe('random math app', () => {
  it('can make calculations', () => {
    // Step 1: Open the app
    cy.visit('/');

    // Step 2: Alias the first and second numbers using XPath
    cy.xpath('/html/body/app-root/div/div/mat-card/mat-card-content/div/div[1]/div/span')
      .as('first-value');
    cy.xpath('/html/body/app-root/div/div/mat-card/mat-card-content/div/div[2]/div[2]/span')
      .as('second-value');

    // Step 3: Extract both values and calculate the total
    cy.get('@first-value').invoke('text').then(firstText => {
      cy.get('@second-value').invoke('text').then(secondText => {
        const first = parseInt(firstText.trim());
        const second = parseInt(secondText.trim());
        const total = first + second;

        //Print message with values to the Cypress Command Log in the Test Runner panel
        cy.log(`First: ${first}, Second: ${second}, Total: ${total}`);

        // Step 4: Force typing into the number input (bypass overlap issue)
        cy.get('input[type="number"]')
          //.clear({ force: true })   // Clear any existing value
          .type(`${total}`, { force: true });  // Enter the sum

        // Step 5: Click the "Answer" button once enabled
        cy.contains('button', 'Answer')
          .should('not.be.disabled')
          .click();

        // Step 6: Verify that the "That's right. Try another" window opens
        cy.get('#toast-container')
          .should('be.visible')
          .should('contain.text', "That's right");


        // Step 7: Verify the "That's right. Try another" window is closed after 6 seconds
        cy.get('#toast-container', { timeout: 6000 }).should('not.be.visible');

        // Step 8: Verify the number input field is cleared and ready for the next entry
        cy.get('input[type="number"]').should('have.value', '');

      });
    });
  });
});
