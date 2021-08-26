import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch, Route, useRouteMatch
} from 'react-router-dom'

import Notification from './components/Notification'
import MainPage from './components/MainPage'
import LoginForm from './components/LoginForm'

import loginService from './services/login'
import blogService from './services/blogs'
import { getAllUsers } from './reducers/allUsersReducer'

import { setSignedInUser  } from './reducers/signedInUserReducer'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'

import UsersViewPage from './components/UsersViewPage'
import SingleUserViewPage from './components/SingleUserViewPage'
import SingleBlogViewPage from './components/SingleBlogViewPage'
import MenuNavigator from './components/MenuNavigator'
import { Button, Page } from './styles/styledComponents'


const App = () => {
  const signedInUser = useSelector(state => state.signedInUser)
  const allUsers = useSelector(state => state.allUsers)
  const blogs = useSelector(state => state.blogs)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setSignedInUser())
  }, [dispatch])

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const [loginVisible, setLoginVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setSignedInUser())
      dispatch(setNotification(`${user.name} logged in`,5,'green'))
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      dispatch(setNotification('wrong credentials',5,'red'))
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <Page>
        <div style={hideWhenVisible}>
          <Button onClick={() => setLoginVisible(true)}>log in</Button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <Button onClick={() => setLoginVisible(false)}>cancel</Button>
        </div>
      </Page>
    )
  }

  const matchUsers = useRouteMatch('/users/:id')
  const user_to_show = matchUsers
    ? allUsers.find(user => user.id === matchUsers.params.id)
    : null

  const matchBlogs = useRouteMatch('/blogs/:id')
  const blog_to_show = matchBlogs
    ? blogs.find(blog => blog.id === matchBlogs.params.id)
    : null

  if (!signedInUser) {return loginForm()}

  return (
    <div>
      <Router>
        <MenuNavigator />
        <Notification />
        <Switch >
          <Route path="/users/:id">
            <SingleUserViewPage user={user_to_show} />
          </Route>
          <Route path="/blogs/:id">
            <SingleBlogViewPage blog={blog_to_show}/>
          </Route>
          <Route path='/users'>
            <UsersViewPage />
          </Route>
          <Route path='/'>
            <MainPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App