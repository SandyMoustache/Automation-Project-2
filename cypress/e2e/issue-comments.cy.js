describe('Issue comments creating, editing, and deleting', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  const getConfirmModal = () => cy.get('[data-testid="modal:confirm"]');

  it('Should create, edit, and delete a comment successfully in a single test', () => {
    const comment = 'TEST_COMMENT';
    const editedComment = 'TEST_COMMENT_EDITED';

    // Step 1: Add a comment
    getIssueDetailsModal().within(() => {
      cy.contains('Add a comment...').click();
      cy.get('textarea[placeholder="Add a comment..."]').type(comment);
      cy.contains('button', 'Save').click();
    });

    // Assert that the comment has been added
    getIssueDetailsModal().within(() => {
      cy.contains(comment).should('exist');
    });

    // Step 2: Edit the added comment
    getIssueDetailsModal().within(() => {
      cy.contains(comment).parent().contains('Edit').click();
      cy.get('textarea[placeholder="Add a comment..."]').clear().type(editedComment);
      cy.contains('button', 'Save').click();
    });

    // Assert that the updated comment is visible
    getIssueDetailsModal().within(() => {
      cy.contains(editedComment).should('exist');
    });

    // Step 3: Delete the comment
    getIssueDetailsModal().within(() => {
      cy.contains(editedComment).parent().contains('Delete').click();
    });

    // Confirm deletion
    getConfirmModal().within(() => {
      cy.contains('button', 'Delete comment').click();
    });

    // Assert that the comment is removed
    getIssueDetailsModal().within(() => {
      cy.contains(editedComment).should('not.exist');
    });
  });
});
