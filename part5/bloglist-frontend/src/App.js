import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)

  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notice, setNotice] = useState(null)
  const [noticeColor, setNoticeColor] = useState('green')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const toNotify = (msg) => {
    setNotice(msg)
    setTimeout(() => {
      setNotice(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      // console.log(window.localStorage.getItem('loggedBlogappUser'))
      blogService.setToken(user.token)
      setUser(user)

      const name_to_show = JSON.parse(window.localStorage.getItem('loggedBlogappUser')).name

      setNoticeColor('green')
      toNotify(`${name_to_show} logged in`)

      setUsername('')
      setPassword('')
    }
    catch (exception) {
      // console.log(exception)
      setNoticeColor('red')
      toNotify('wrong credentials')
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (newObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService.create(newObject)
      const new_allBlogs = await blogService.getAll()
      setBlogs(new_allBlogs)
      setNoticeColor('green')
      toNotify(`a new blog ${newObject.title} by ${newObject.author} added`)
    }
    catch (exception) {
      setNoticeColor('red')
      toNotify('failed when creating a new blog, check again')
    }
  }

  const likeBlog = async (blog) => {
    try{
      await blogService.update(blog.id, { ...blog, 'likes':blog.likes+1 })
      const new_allBlogs = await blogService.getAll()
      setBlogs(new_allBlogs)
      setNoticeColor('green')
      toNotify('like a blog successfully')
    }
    catch (exception){
      // console.log('exception during creating a blog,check title, author and url again')
      setNoticeColor('red')
      toNotify('failed when liking a blog, check again')
    }
  }

  const deleteBlog = async (blog) => {
    try{
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
        await blogService.remove(blog.id)
        const new_allBlogs = await blogService.getAll()
        setBlogs(new_allBlogs)
        setNoticeColor('green')
        toNotify('delete a blog successfully')
      }
    }
    catch (exception) {
      setNoticeColor('red')
      toNotify('failed when deleting a blog, try again')
    }
  }

  const loginForm =() => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <div>{`${user.username} logged in`}
        <button type="submit" onClick={handleLogout}> {'logout'} </button>
      </div>

      <Togglable buttonLabel='create new blog'  ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <div>
        {blogs
          .sort((blogA,blogB) => blogB.likes - blogA.likes)
          .map(blog => <Blog key={blog.id} blog={blog} updateBlogByLikes = {likeBlog}
            removeBlog={deleteBlog} current_username={user.username}/> )
        }
      </div>
    </div>
  )


  return (
    <div>
      <Notification message={notice} color={noticeColor}/>
      {user === null && loginForm()}
      {user !== null && blogForm()}
    </div>
  )
}

export default App