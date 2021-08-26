import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const signedInUserReducer  = (state=null, action) => {
  if(action.type === 'SET') return action.data
  else if (action.type === 'LOGOUT') return null
  else return state
}

export const logoutSignedInUser = () => {
  return async dispatch => {
    try{
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      dispatch({
        type: 'LOGOUT'
      })
    }
    catch(exception){
      dispatch(setNotification('Exception occurs when logout current user',5,'red'))
    }
  }
}

export const setSignedInUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try{
        const user = JSON.parse(loggedUserJSON)
        blogService.setToken(user.token)
        dispatch({
          type: 'SET',
          data: user,
        })
      }
      catch(exception){
        dispatch(setNotification('Exception occurs when setting current user',5,'red'))
      }
    }
  }
}


export default signedInUserReducer