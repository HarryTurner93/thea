/// <reference types="cypress" />
/// <reference types="cypress-file-upload" />

describe('smoke', () => {
  it('should handle normal app flow', () => {
    // Registration.
    cy.visit('http://localhost:3000/');

    // Login
    cy.get('[data-name="username"]').type('harry');
    cy.get('[data-name="password"]').type('4loaseheb4');
    cy.get('[data-name="submit"]').click();

    // Add Camera
    cy.get('[data-name="circle-button-＋"]').click();
    cy.get('body').click(100, 100);
    cy.get('[data-name="enter-camera-name"]').type('test_camera');
    cy.contains('Confirm Name').click();

    // Camera Dialog
    cy.get('[id="test_camera"]').click();
    cy.contains('✕').click();

    // Upload Images
    cy.get('[id="test_camera"]').click();
    cy.contains('Browse Images').should('be.disabled');
    cy.get('input[type="file"]').attachFile('test.jpg');
    cy.wait(1000);
    cy.get('[data-name="upload-images"]').click();
    cy.wait(500);

    // Browse Images
    cy.contains('Browse Images').should('be.enabled');
    cy.get('[data-name="label-Images"]').should('have.text', '1');
    cy.contains('Browse Images').click();
    cy.contains('✕').click();

    // Delete Camera
    cy.get('[id="test_camera"]').click();
    cy.contains('Delete Camera').click();
    cy.contains('Cancel').click();
    cy.contains('Delete Camera').click();
    cy.contains('Confirm Delete').click();

    // Logout
    cy.get('[data-name="circle-button-➜"]').click();
    cy.contains('Cancel').click();
    cy.get('[data-name="circle-button-➜"]').click();
    cy.contains('Log Out').click();
  });
});
