import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls handler correctly', async () => {
  const createBlog = jest.fn()
  const mockUser = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)
  const inputTitle = container.querySelector('#blogform-title-input')
  const inputAuthor = container.querySelector('#blogform-author-input')
  const inputUrl = container.querySelector('#blogform-url-input')

  const sendButton = screen.getByText('Create')

  await mockUser.type(inputTitle, 'testing title')
  await mockUser.type(inputAuthor, 'testing author')
  await mockUser.type(inputUrl, 'testing URL')
  await mockUser.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing URL')
})
