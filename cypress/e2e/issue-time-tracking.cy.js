describe('Manage Estimation and Time Tracking for an Issue', () => {
  // Selectors
  const issueDetailView = '[data-testid="modal:issue-details"]';
  const estimateField = '[placeholder="Number"]';
  const timeTrackingButton = '[data-testid="icon:stopwatch"]'; // Button to open time tracking modal
  const timeTrackingModal = '[data-testid="modal:tracking"]'; // Selector for the time tracking modal
  const timeSpentField = `${timeTrackingModal} input[placeholder="Number"]:first`; // First input field for time spent
  const timeRemainingField = `${timeTrackingModal} input[placeholder="Number"]:nth-of-type(2)`; // Second input field for time remaining
  const doneButton = '[data-testid="button-done"]'; // Button in time tracking modal
  const closeModalButton = `${timeTrackingModal} [data-testid="icon:close"]`; // Close button in time tracking modal

  // Test data
  const initialEstimate = '10';
  const updatedEstimate = '20';
  const loggedTimeSpent = '2';
  const loggedTimeRemaining = '5';

  beforeEach(() => {
    // Navigate to the issue detail view before each test
    cy.visit('/project/board'); // Adjust the URL as needed
    cy.get('[data-testid="list-issue"]').first().click(); // Open the first issue in the backlog
    cy.get(issueDetailView).should('be.visible');
  });

  it('Add, Update, and Remove Estimation', () => {
    // Add Estimation
    cy.get(estimateField).clear().type(initialEstimate);
    cy.wait(1000); // Wait to ensure the update is processed
    cy.get('[data-testid="icon:close"]').first().click(); // Close the issue detail view
    cy.reload();
    cy.get('[data-testid="list-issue"]').first().click(); // Reopen the same issue
    cy.get(estimateField).should('have.value', initialEstimate);

    // Update Estimation
    cy.get(estimateField).clear().type(updatedEstimate);
    cy.wait(1000); // Wait to ensure the update is processed
    cy.get('[data-testid="icon:close"]').first().click(); // Close the issue detail view
    cy.reload();
    cy.get('[data-testid="list-issue"]').first().click(); // Reopen the same issue
    cy.get(estimateField).should('have.value', updatedEstimate);

    // Remove Estimation
    cy.get(estimateField).clear();
    cy.wait(1000); // Wait to ensure the update is processed
    cy.get('[data-testid="icon:close"]').first().click(); // Close the issue detail view
    cy.reload();
    cy.get('[data-testid="list-issue"]').first().click(); // Reopen the same issue
    cy.get(estimateField).should('have.value', ''); // Check if the estimation is removed and field is empty
  });

  it('Log and Remove Time', () => {
    // Open Time Tracking Modal
    cy.get(timeTrackingButton).click();
    cy.get(timeTrackingModal).should('be.visible'); // Ensure the modal is visible
  
    // Verify and log time spent
    cy.get(timeTrackingModal)
      .find('input[placeholder="Number"]')
      .eq(0) // Index 0 for the first "Time Spent" input
      .should('be.visible')
      .clear()
      .type(loggedTimeSpent);
  
    // Verify and log time remaining
    cy.get(timeTrackingModal)
      .find('input[placeholder="Number"]')
      .eq(1) // Index 1 for the "Time Remaining" input
      .should('be.visible')
      .clear()
      .type(loggedTimeRemaining);
  
    cy.contains('button', 'Done').click(); // Click the "Done" button
  
    // Reopen and verify logged time
    cy.get(timeTrackingButton).click();
    cy.get(timeTrackingModal)
      .should('contain', `${loggedTimeSpent}h logged`)
      .and('contain', `${loggedTimeRemaining}h remaining`);
  
    // Remove logged time
    cy.get(timeTrackingModal).should('be.visible'); // Ensure the modal is visible again
    cy.get(timeTrackingModal)
      .find('input[placeholder="Number"]')
      .eq(0) // Index 0 for "Time Spent"
      .clear();
    cy.get(timeTrackingModal)
      .find('input[placeholder="Number"]')
      .eq(1) // Index 1 for "Time Remaining"
      .clear();
    
    cy.contains('button', 'Done').click(); // Click the "Done" button
  
    // Verify that time logging is cleared
    cy.get(timeTrackingButton).click();
    cy.get(timeTrackingModal).should('be.visible'); // Ensure the modal is visible before asserting
  
    // Close the Time Tracking Modal
    cy.get(closeModalButton).click();
  });
});