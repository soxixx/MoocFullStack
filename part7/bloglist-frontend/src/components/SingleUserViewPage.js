import React from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../styles/styledComponents'


const SingleUserViewPage = ({ user }) => {
  if (!user) return null
  return (
    <Page>
      <h2>blog app</h2>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user.blogs.map(blog => <li key={blog.id}>
        <Link to={`/blogs/${blog.id}`}> {blog.title} </Link>
      </li>)}
    </Page>
  )
}

export default SingleUserViewPage