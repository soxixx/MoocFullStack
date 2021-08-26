import React, { useState } from 'react'

const Blog = ({ blog,updateBlogByLikes,removeBlog,current_username }) => {
  const [viewVisible, setViewVisible] = useState(false)

  const handleLikeBlog = async (event) => {
    event.preventDefault()
    updateBlogByLikes(blog)
  }

  const handleDeleteBlog = async (event) => {
    event.preventDefault()
    removeBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: viewVisible ? 'none' : '' }
  const showWhenVisible = { display: viewVisible ? '' : 'none' }

  // const current_name = JSON.parse(window.localStorage.getItem('loggedBlogappUser')).name
  // const current_username = JSON.parse(window.localStorage.getItem('loggedBlogappUser')).username
  const deleteOrNot = blog.user.username === current_username ? true : false
  const showDeleteButton = { display: deleteOrNot ? '' : 'none' }

  return (
    <div id='single-blog' style={blogStyle}>
      <div style={hideWhenVisible}>
        <div className='title_and_author'>{blog.title} {blog.author}</div>
        <button id='view_button' onClick={() => setViewVisible(true)}>view</button>
      </div>
      <div id='detailed_blog' style={showWhenVisible}>
        <div className='title_and_author'>{blog.title} {blog.author} </div>
        <button onClick={() => setViewVisible(false)}>hide</button>
        <div className='url'>{blog.url}</div>
        <div id='likes' className='likes'>likes {blog.likes}
          <button id='like_button' onClick={handleLikeBlog}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={showDeleteButton}><button id='remove_button' onClick={handleDeleteBlog}>remove</button></div>
      </div>
    </div>
  )

}

export default Blog