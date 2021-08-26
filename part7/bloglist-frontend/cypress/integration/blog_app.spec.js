describe('Blog app', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      'name':'Matti Luukkainen',
      'username':'mluukkai',
      'password':'salainen'
    }
    cy.request('POST','http://localhost:3003/api/users',user)
    cy.visit('http://localhost:3000')
  })

  //5.17
  it('Login form is shown', function() {
    cy.contains('log in').click()
    cy.contains('username')
    cy.contains('password')
  })

  //5.18
  describe('Log in', function () {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login_button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong password', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login_button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      //   cy.contains('log in').click()
      //   cy.get('#username').type('mluukkai')
      //   cy.get('#password').type('salainen')
      //   cy.get('#login_button').click()
      //   cy.contains('Matti Luukkainen logged in')

    })

    //5.19
    it('A blog can be created', function() {
    //   cy.contains('create new blog').click()
    //   cy.get('#title_input').type('a blog created by cypress')
    //   cy.get('#author_input').type('cypress author')
    //   cy.get('#url_input').type('cypress url')
    //   cy.get('#blog_submit_button').click()
    //   cy.contains('a blog created by cypress')
      cy.createBlog({ title: 'a blog created by cypress',
        author: 'cypress author',
        url: 'cypress url',
        likes: 0 })
    })

    //5.20
    it('A blog can be liked', function() {
      cy.createBlog({ title: 'second blog created by cypress',
        author: 'cypress author',
        url: 'cypress url' })
      cy.get('#single-blog')
        .contains('view').click()
      cy.get('.likes').contains('likes 0')

      cy.contains('like').click()
      cy.get('.likes').contains('likes 1')
    })

    //5.21
    it('A blog can be deleted by its creator', function () {
      cy.createBlog({
        title: 'third blog created by cypress',
        author: 'cypress author',
        url: 'cypress url',
        likes: 0
      })
      cy.contains('view').click()
      cy.get('.title_and_author').contains('third blog created by cypress cypress author')
      cy.get('#remove_button').click()
      cy.get('html').should('not.contain', 'third blog created by cypress cypress author')
    })
  })

  //5.22
  describe('Two users in the database: ', function () {
    beforeEach(function () {
      const user2 = {
        name: 'superuser',
        username: 'root',
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user2)

      cy.login({ username:'root',password:'salainen' })

      cy.createBlog({
        title: 'first blog by user2',
        author: 'cypress author 2',
        likes: 10,
        url: 'cypress url 2'
      })

      cy.createBlog({
        title: 'second blog by user2',
        author: 'cypress author 2',
        likes: 8,
        url: 'cypress url 2'
      })

      cy.visit('http://localhost:3000')
      cy.contains('logout').click()

      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({ title: 'a blog created by user1',
        author: 'cypress author',
        url: 'cypress url',
        likes: 0
      })
    })

    it('A blog cannot be deleted by other user', function () {
      cy.get('#view_button')
        .click()
        .get('html').should('not.contain', 'Remove')
    })

    it('blogs sorted by property likes', function() {
      cy.get('#single-blog').eq(0).should('contain','10').next().contains('8')
      cy.get('#single-blog').eq(0).next().next().contains('0')
    })
  })
})