import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    const success = await createBlog({ title, author, url })
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }


  return (
    <form onSubmit={handleCreateBlog}>
      <h2>create new</h2>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          id="blogform-title-input"
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          id="blogform-author-input"
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          id="blogform-url-input"
        />
      </div>
      <button type="submit">Create</button>
    </form>
  )
}

export default BlogForm