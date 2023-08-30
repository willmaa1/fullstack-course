import { useState } from 'react'

const Blog = ({ blog, removeBlog, updateBlog, user }) => {
  const [collapsed, setCollapsed] = useState(true)

  const blogExpanded = () => {
    return (
      <>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button className='blog-like' onClick={() => { blog.likes++; updateBlog(blog) }}>like</button></div>
        <div>{blog.user.username}</div>
        { blog.user.username !== user.username ? '' : <button onClick={() => removeBlog(blog)}>remove</button> }
      </>
    )
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button className='blog-expand-toggle' onClick={() => setCollapsed(!collapsed)}>{ collapsed ? 'view' : 'hide' }</button>
      </div>
      { collapsed ? '' : blogExpanded()}
    </div>
  )
}

export default Blog