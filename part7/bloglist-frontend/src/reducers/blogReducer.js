import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogReducer = (state = [], action) => {
  if (action.type === 'INIT_BLOGS'){
    return action.data
  }
  else if (action.type === 'NEW_BLOG'){
    return action.data
  }
  else if (action.type === 'LIKE_BLOG'){
    return action.data
  }
  else if (action.type === 'DELETE_BLOG'){
    return action.data
  }
  else if (action.type === 'COMMENT_BLOG'){
    return action.data
  }
  return state
}

export const initializeBlogs = () => {
  return async dispatch => {
    try{
      const blogs = await blogService.getAll()
      dispatch({
        type: 'INIT_BLOGS',
        data: blogs,
      })
    }
    catch(exception){
      dispatch(setNotification('Exception occurs when initializing blogs',5,'red'))
    }
  }
}

export const createBlog = (newBlog) => {
  return async dispatch => {
    try{
      await blogService.create(newBlog)
      const blogs = await blogService.getAll()
      dispatch({
        type: 'NEW_BLOG',
        data: blogs,
      })
    }
    catch(exception){
      dispatch(setNotification('Exception occurs when creating a blog',5,'red'))
    }
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    try{
      await blogService.update(blog.id, { ...blog, 'likes':blog.likes+1 })
      const blogs = await blogService.getAll()
      dispatch({
        type: 'LIKE_BLOG',
        data: blogs
      })
    }
    catch(exception){
      dispatch(setNotification('Exception occurs when liking a blog',5,'red'))
    }
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    try{
      await blogService.remove(blog.id)
      const blogs = await blogService.getAll()
      dispatch({
        type: 'DELETE_BLOG',
        data: blogs
      })
    }
    catch(exception){
      dispatch(setNotification('Exception occurs when deleting a blog',5,'red'))
    }
  }
}

export const commentBlog = (blog, comment) => {
  return async dispatch => {
    try{
      await blogService.commentBlog(blog.id, { content: comment })
      const blogs = await blogService.getAll()
      dispatch({
        type: 'COMMENT_BLOG',
        data: blogs
      })
    }
    catch(exception){
      dispatch(setNotification('Exception occurs when commenting a blog',5,'red'))
    }
  }
}

export default blogReducer