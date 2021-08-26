const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')


describe('TEST USER API: when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'superuser', passwordHash })
    
    const promiseArray = [user.save()]
    await Promise.all(promiseArray)
  })

  //4.15
  test('get all user details', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain('root')

    const names = usersAtEnd.map(u => u.name)
    expect(names).toContain('superuser')
  })

  //4.16
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  //4.16
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  //4.16
  test('creation fails when a user added with invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Angel Bob',
      password: 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  //4.16
  test('creation fails when a user added with invalid password', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'abc',
      name: 'Angel Bob-Canon',
      password: '12'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  
})

describe('TEST BLOG API: ', () =>{
  describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
  
      const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

    //4.8
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    //4.9
    test('unique property: id?', async () => {
        const blogs = await helper.blogsInDb()
        // console.log('blogs[0]: ', blogs[0])
        expect(blogs[0].id).toBeDefined()
    })

    //4.17
    test('a blog contains a creator (user)', async () =>{
      await Blog.deleteMany({})

      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token


      const test_blog_1 = {
        "title":"this is a test blog 1",
        "author": "youknowwho1",
        "url": "http://youknowwhat1",
        "likes":0
      }

      const test_blog_2= {
        "title":"this is a test blog 2",
        "author": "youknowwho2",
        "url": "http://youknowwhat2",
        "likes":0
      }
      
      await api
      .post('/api/blogs')
      .send(test_blog_1)
      .set('Authorization', `bearer ${token_to_login}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

      await api
      .post('/api/blogs')
      .send(test_blog_2)
      .set('Authorization', `bearer ${token_to_login}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)


      const resp = await api.get('/api/users')
      const users = resp.body
      // console.log(users[0].blogs[0])
      expect(users[0].blogs).toHaveLength(2)
      
      const response = await api.get('/api/blogs')
      const blogs = response.body
      // console.log(blogs)
      expect(blogs[blogs.length -1].user).toBeDefined()
    })
  })

  describe('operations of single existing blog', () => {
    //4.18 4.20 already done
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', name:'superuser', passwordHash })
      await user.save()

      await Blog.deleteMany({})
      const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

    //4.10 + 4.19
    test('post a blog from its creator (user) => success', async () =>{
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token

      const blog_to_add = {
        title: 'adding a new blog from its creator',
        author: 'youknowwho',
        url: 'http://youknowwhat',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(blog_to_add)
        .set('Authorization', `bearer ${token_to_login}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain('adding a new blog from its creator')
    })

    //4.19
    test('post a blog with wrong token => fail', async () =>{
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token
      const reversed_token = token_to_login.split("").reverse().join("")

      const blog_to_add = {
        title: 'adding a new blog from its creator',
        author: 'youknowwho',
        url: 'http://youknowwhat',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(blog_to_add)
        .set('Authorization', `bearer ${reversed_token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    //4.19 + 4.23
    test('post a blog with no token => fail', async () =>{
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token

      const blog_to_add = {
        title: 'adding a new blog from its creator',
        author: 'youknowwho',
        url: 'http://youknowwhat',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(blog_to_add)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    
    //4.13 + 4.21
    test('a blog deleted by its creator => success', async () => {
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token
      

      const blog_to_add = {
        title: 'adding a new blog from its creator',
        author: 'youknowwho',
        url: 'http://youknowwhat',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(blog_to_add)
        .set('Authorization', `bearer ${token_to_login}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const blogs = await helper.blogsInDb()
      const blog_to_delete = blogs[blogs.length-1]

      // console.log(blog_to_delete)
      await api
        .delete(`/api/blogs/${blog_to_delete.id}`)
        .set('Authorization', `bearer ${token_to_login}`)
        .expect(204)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect (blogsAtEnd).toHaveLength(blogs.length - 1)
    })

    //4.21
    test('a blog deleted with wrong token => success', async () => {
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token
      const reversed_token = token_to_login.split("").reverse().join("")

      const blog_to_add = {
        title: 'adding a new blog from its creator',
        author: 'youknowwho',
        url: 'http://youknowwhat',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(blog_to_add)
        .set('Authorization', `bearer ${token_to_login}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const blogs = await helper.blogsInDb()
      const blog_to_delete = blogs[blogs.length-1]

      // console.log(blog_to_delete)
      await api
        .delete(`/api/blogs/${blog_to_delete.id}`)
        .set('Authorization', `bearer ${reversed_token}`)
        .expect(401)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect (blogsAtEnd).toHaveLength(blogs.length)
    })

    //4.21
    test('a blog deleted with no token => success', async () => {
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token

      const blog_to_add = {
        title: 'adding a new blog from its creator',
        author: 'youknowwho',
        url: 'http://youknowwhat',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(blog_to_add)
        .set('Authorization', `bearer ${token_to_login}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const blogs = await helper.blogsInDb()
      const blog_to_delete = blogs[blogs.length-1]

      // console.log(blog_to_delete)
      await api
        .delete(`/api/blogs/${blog_to_delete.id}`)
        .expect(401)
        // .set('Authorization', `bearer ${reversed_token}`)
  
      const blogsAtEnd = await helper.blogsInDb()
      expect (blogsAtEnd).toHaveLength(blogs.length)
    })
  })

  describe('When adding a blog: ', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', name:'superuser', passwordHash })
      await user.save()

      await Blog.deleteMany({})
      const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

    //4.11
    test('a blog added (without property "likes")', async () => {
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token

      const newBlog = {
          "title": 'test without property "likes"',
          "author": "SXC",
          "url": "http://make-up-url-for-test"
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token_to_login}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBe(0)
      expect(blogsAtEnd[blogsAtEnd.length-1].title).toBe('test without property "likes"')
      expect(blogsAtEnd[blogsAtEnd.length-1].author).toBe("SXC")
      expect(blogsAtEnd[blogsAtEnd.length-1].url).toBe("http://make-up-url-for-test")
    })

    //4.12
    test('a blog could not be added without title or url', async () =>{
      const user_to_login = {
        username: 'root',
        password: 'sekret'
      }

      const res = await api
        .post('/api/login')
        .send(user_to_login)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token_to_login = res.body.token

      const newBlog1 = {
        author: 'test1',
        url: 'test1',
        likes: 0,
      }
      const newBlog2 = {
        title: 'test2',
        author: 'test2',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .send(newBlog1)
        .set('Authorization',`bearer ${token_to_login}`)
        .expect(400)

      await api
      .post('/api/blogs')
      .send(newBlog2)
      .set('Authorization',`bearer ${token_to_login}`)
      .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    //4.14
    test('a blog to be updated',async () => {
      const blogsAtStart = await helper.blogsInDb()
      const firstBlog = blogsAtStart[0]

      const updated_likes = firstBlog.likes + 1

      await api
        .put(`/api/blogs/${firstBlog.id}`)
        .send({...firstBlog,"likes":updated_likes})
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect (blogsAtEnd[0].likes).toBe(updated_likes)
    })
  })
})


afterAll(() => {
  mongoose.connection.close()
})