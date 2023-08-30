describe('Blog app', function() {
  beforeEach(function() {
    const user = {
      name: 'Cypress tester',
      username: 'ctester',
      password: 'ctestpass'
    }
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
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

  describe('When logged in', function() {
    this.beforeEach(function() {
      cy.get('#login-username').type('ctester')
      cy.get('#login-password').type('ctestpass')
      cy.get('#login-login').click()
      cy.contains('Logged in')
    })

    it('a blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#blogform-title-input').type('Blog title')
      cy.get('#blogform-author-input').type('Blog author')
      cy.get('#blogform-url-input').type('URL')
      cy.contains('Create').click()
      cy.get('.blog').should('have.length', 1)
    })

    describe('After creating a blog', function() {
      this.beforeEach(function() {
        cy.contains('create new blog').click()
        cy.get('#blogform-title-input').type('Blog title')
        cy.get('#blogform-author-input').type('Blog author')
        cy.get('#blogform-url-input').type('URL')
        cy.contains('Create').click()
        cy.get('.blog').should('have.length', 1)
      })

      it('can be deleted', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
      })

      it('can be liked', function() {
        cy.contains('view').click()
        cy.contains('like').click()
      })


      it('blogs are ordered by likes in desending order', function() {
        cy.intercept('GET', '/api/blogs').as('getBlogs') // Using PUT /api/blogs/* did not work nicely

        cy.contains('create new blog').click()
        cy.get('#blogform-title-input').type('Most likes')
        cy.get('#blogform-author-input').type('Good author')
        cy.get('#blogform-url-input').type('URL')
        cy.contains('Create').click()
        cy.get('.blog').should('have.length', 2)
        cy.get('.blog').eq(0).find('button').contains('view').click()
        cy.get('.blog').eq(1).find('button').contains('view').click()

        cy.get('.blog').eq(1).should('contain', 'Most likes').find('button').contains('like').click()
        cy.wait('@getBlogs')
        cy.get('.blog').eq(0).should('contain', 'Most likes').find('button').contains('like').click()
        cy.wait('@getBlogs')
        cy.get('.blog').eq(0).should('contain', 'Most likes').find('button').contains('like').click()
        cy.wait('@getBlogs')
        cy.get('.blog').eq(1).should('contain', 'Blog title').find('button').contains('like').click()
        cy.wait('@getBlogs')

        cy.get('.blog').eq(0).should('contain', 'Most likes')
        cy.get('.blog').eq(1).should('contain', 'Blog title')
      })

      describe('Another user', function() {
        this.beforeEach(function() {
          const maluser = {
            name: 'Malicious user',
            username: 'maluser',
            password: 'malpass'
          }
          cy.request('POST', 'http://localhost:3003/api/users/', maluser)

          cy.contains('logout').click()
          cy.get('#login-username').type('maluser')
          cy.get('#login-password').type('malpass')
          cy.get('#login-login').click()
          cy.contains('Logged in')
        })

        it('can like it', function() {
          cy.contains('view').click()
          cy.contains('like').click()
        })

        it('cannot delete it', function() {
          cy.contains('view').click()
          cy.contains('remove').should('not.exist')
        })
      })
    })
  })
})