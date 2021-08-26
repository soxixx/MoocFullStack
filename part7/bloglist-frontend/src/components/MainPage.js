import React,{ useRef } from 'react'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import BlogList from './BlogList'
import { Page } from '../styles/styledComponents'

const MainPage = () => {
  const blogFormRef = useRef()
  return (
    <Page>
      <h2>blog app</h2>
      <Togglable buttonLabel='create new' ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef}/>
      </Togglable>
      <BlogList />
    </Page>
  )

}

export default MainPage