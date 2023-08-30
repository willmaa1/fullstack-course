describe('Blog app', function() {
  beforeEach(function() {
    const user = {
      name: 'Cypress tester',
      username: 'ctester',
      password: 'ctestpass'
    }
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('GET', 'http://localhost:3003/api/users/')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#login-form')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#login-username').type('ctester')
      cy.get('#login-password').type('ctestpass')
      cy.get('#login-login').click()

      cy.contains('Logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#login-username').type('ctester')
      cy.get('#login-password').type('wrong')
      cy.get('#login-login').click()
      cy.contains('Wrong credentials')
    })
  })
})