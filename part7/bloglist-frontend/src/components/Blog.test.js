import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import Blog from './Blog'
import BlogForm from './BlogForm'

//5.13
test('5.13 Blog list test (title and author)', () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'nobody',
    'url': 'http://componet-test',
    'user': { 'name': 'test-name', 'username': 'test'
    }
  }

  const mockLikeBlog = jest.fn()
  const mockRemoveBlog = jest.fn()

  const component = render(<Blog blog={blog} current_name={'test-name'} current_username={'test'}
    updateBlogByLikes = {mockLikeBlog} removeBlog={mockRemoveBlog}/>)

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(component.container.querySelector('.title_and_author')).toHaveTextContent(
    'Component testing is done with react-testing-library nobody'
  )
})

//5.14
test('5.14* Blog list test (view: url and likes)', () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'nobody',
    'url': 'http://componet-test',
    'user': { 'name': 'test-name', 'username': 'test' },
    'likes': 100
  }

  const mockLikeBlog = jest.fn()
  const mockRemoveBlog = jest.fn()

  const component = render(<Blog blog={blog} current_name={'test-name'} current_username={'test'}
    updateBlogByLikes = {mockLikeBlog} removeBlog={mockRemoveBlog}/>)

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(component.container.querySelector('.title_and_author')).toHaveTextContent(
    'Component testing is done with react-testing-library nobody'
  )

  const view_button = component.getByText('view')
  fireEvent.click(view_button)

  expect(component.container.querySelector('.url')).toHaveTextContent(
    'http://componet-test'
  )
  expect(component.container.querySelector('.likes')).toHaveTextContent(100)
})

//5.15
test('5.15* Blog list test (like twice)', () => {
  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'nobody',
    'url': 'http://componet-test',
    'user': { 'name': 'test-name', 'username': 'test' },
    'likes': 0
  }

  const mockLikeBlog = jest.fn()
  const mockRemoveBlog = jest.fn()

  const component = render(<Blog blog={blog} current_name={'test-name'} current_username={'test'}
    updateBlogByLikes = {mockLikeBlog} removeBlog={mockRemoveBlog}/>)

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(component.container.querySelector('.title_and_author')).toHaveTextContent(
    'Component testing is done with react-testing-library nobody'
  )
  expect(component.container.querySelector('.url')).toHaveTextContent(
    'http://componet-test'
  )

  const like_button = component.getByText('like')
  fireEvent.click(like_button)
  expect(mockLikeBlog.mock.calls).toHaveLength(1)

  fireEvent.click(like_button)
  expect(mockLikeBlog.mock.calls).toHaveLength(2)
})

//5.16
test('5.16*: Blog list tests (inputs and form)', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title_input = component.container.querySelector('#title_input')
  const author_input = component.container.querySelector('#author_input')
  const url_input = component.container.querySelector('#url_input')

  const form = component.container.querySelector('form')

  fireEvent.change(title_input, {
    target: { value: 'new title' }
  })

  fireEvent.change(author_input, {
    target: { value: 'new author' }
  })

  fireEvent.change(url_input, {
    target: { value: 'new url' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('new title')
  expect(createBlog.mock.calls[0][0].author).toBe('new author')
  expect(createBlog.mock.calls[0][0].url).toBe('new url')
})
