import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setNotification } from '../reducers/notificationReducer'
import { commentBlog, deleteBlog, likeBlog } from '../reducers/blogReducer'
import { useHistory } from 'react-router-dom'
import { Input, Page } from '../styles/styledComponents'

const SingleBlogViewPage = ({ blog }) => {
  if (!blog) return null
  else{
    const history = useHistory()
    const signedInUser = useSelector(state => state.signedInUser)
    const dispatch = useDispatch()
    const deleteOrNot = blog.user.username === signedInUser.username ? true : false
    const showDeleteButton = { display: deleteOrNot ? '' : 'none' }

    const toLikeBlog = (blog) => {
      try{
        dispatch(likeBlog(blog))
        dispatch(setNotification('like a blog successfully',5,'green'))
      }
      catch (exception){
        dispatch(setNotification('failed when liking a blog, check again',5,'red'))
      }
    }

    const toDeleteBlog = (blog) => {
      try{
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
          dispatch(deleteBlog(blog))
          dispatch(setNotification('delete a blog successfully',5,'green'))
          history.push('/')
        }
      }
      catch (exception) {
        dispatch(setNotification('failed when deleting a blog, try again',5,'red'))
      }
    }
    const [comment, setComment] = useState('')

    const handleCommentSubmit = async (event) => {
      event.preventDefault()
      try{
        dispatch(commentBlog(blog, comment))
        dispatch(setNotification('comment a blog successfully',5,'green'))
      }
      catch(exception){
        dispatch(setNotification('failed when commenting a blog, try again',5,'red'))
      }
    }

    return (
      <Page>
        <h2>blog app</h2>
        <h2>{blog.title}</h2>
        <div>{blog.url}</div>
        <div>{blog.likes} likes
          <button onClick={() => toLikeBlog(blog)}>
          like
          </button>
        </div>
        <div>added by {blog.user.name}</div>
        <div style={showDeleteButton}>
          <button onClick={() => toDeleteBlog(blog)}>remove</button>
        </div>
        <h3>comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <Input
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <button type='submit'>add comment</button>
        </form>
        <div>
          {blog.comments.map(comment => <li key={comment.id}>{comment.content}</li>) }
        </div>
      </Page>
    )
  }

}

export default SingleBlogViewPage