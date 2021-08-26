import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import LoginForm from './LoginForm'

import loginService from '../services/login'
import blogService from '../services/blogs'

import { setSignedInUser  } from '../reducers/signedInUserReducer'
import { setNotification } from '../reducers/notificationReducer'

const LoginPage = () => {
  const dispatch = useDispatch()
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

export default LoginPage