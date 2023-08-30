import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const user = {
  username: 'Username'
}

const blog = {
  title: 'Title',
  author: 'Author',
  likes: 0,
  url: 'URL',
  user: user
}

test('Blog rendering', () => {

  const { container } = render(<Blog blog={blog} user={user} />)

  const element = container.querySelector('.blog')

  expect(element).toHaveTextContent('Title')
  expect(element).toHaveTextContent('Author')
  expect(element).not.toHaveTextContent('URL')
  expect(element).not.toHaveTextContent('likes 0')
})

test('Blog expanding', async () => {
  const mockUser = userEvent.setup()

  const { container } = render(<Blog blog={blog} user={user} />)

  const blogElement = container.querySelector('.blog')
  const element = container.querySelector('.blog-expand-toggle')

  await mockUser.click(element)

  expect(blogElement).toHaveTextContent('URL')
  expect(blogElement).toHaveTextContent('likes 0')
})

test('Blog like event handling', async () => {
  const mockHandler = jest.fn()
  const mockUser = userEvent.setup()

  const { container } = render(<Blog blog={blog} user={user} updateBlog={mockHandler} />)

  const blogExpandElement = container.querySelector('.blog-expand-toggle')
  await mockUser.click(blogExpandElement)

  const blogLikeElement = container.querySelector('.blog-like')
  await mockUser.click(blogLikeElement)
  await mockUser.click(blogLikeElement)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
