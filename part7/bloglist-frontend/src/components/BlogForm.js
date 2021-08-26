import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { Input } from '../styles/styledComponents'

const BlogForm = ({ blogFormRef }) => {
  const [blogtitle,setBlogtitle] = useState('')
  const [blogauthor,setBlogauthor] = useState('')
  const [blogurl,setBlogurl] = useState('')

  const handleTitleChange = ({ target }) => {setBlogtitle(target.value)}
  const handleAuthorChange = ({ target }) => {setBlogauthor(target.value)}
  const handleUrlChange = ({ target }) => {setBlogurl(target.value)}

  const dispatch = useDispatch()

  const addBlog = (newObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(newObject))
      dispatch(setNotification(`a new blog ${newObject.title} by ${newObject.author} added`,5,'green'))
    }
    catch (exception) {
      dispatch(setNotification('failed when creating a new blog, check again',5,'red'))
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    const blog_to_add ={
      'title' : blogtitle,
      'author' : blogauthor,
      'url' : blogurl
    }

    addBlog(blog_to_add)

    setBlogtitle('')
    setBlogauthor('')
    setBlogurl('')
  }

  return (
    <div>
      <form onSubmit={handleNewBlog}>
        <div>
          <h2>Create new</h2>
          title:
          <Input
            id='title_input'
            type="text"
            value={blogtitle}
            name="title"
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <Input
            id='author_input'
            type="text"
            value={blogauthor}
            name="author:"
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <Input
            id='url_input'
            type="text"
            value={blogurl}
            name="url:"
            onChange={handleUrlChange}
          />
        </div>
        <button id='blog_submit_button' type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm