import React from 'react'
import { useSelector } from 'react-redux'
import Blog from './Blog'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <div>
      {blogs
        .sort((blogA,blogB) => blogB.likes - blogA.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog}/> )
      }
    </div>
  )
}

export default BlogList