import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogtitle,setBlogtitle] = useState('')
  const [blogauthor,setBlogauthor] = useState('')
  const [blogurl,setBlogurl] = useState('')

  const handleTitleChange = ({ target }) => {setBlogtitle(target.value)}
  const handleAuthorChange = ({ target }) => {setBlogauthor(target.value)}
  const handleUrlChange = ({ target }) => {setBlogurl(target.value)}

  const handleNewBlog = async (event) => {
    event.preventDefault()
    const blog_to_add ={
      'title' : blogtitle,
      'author' : blogauthor,
      'url' : blogurl
    }

    createBlog(blog_to_add)

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
          <input
            id='title_input'
            type="text"
            value={blogtitle}
            name="title"
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            id='author_input'
            type="text"
            value={blogauthor}
            name="author:"
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
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