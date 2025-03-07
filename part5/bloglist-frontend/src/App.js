import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState(null)
  const [msgColor, setMsgColor] = useState(null)

  const blogFormRef = useRef()

  const showMsg = (msg, color) => {
    setMsg(msg)
    setMsgColor(color)
    setTimeout(() => { setMsg(null) }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showMsg('Logged in', 'green')
      await refreshBlogs()

    } catch (exception) {
      showMsg('Wrong credentials', 'red')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem(
      'loggedBloglistUser', JSON.stringify(user)
    )
    setUser(null)
    showMsg('Logged out', 'green')
  }

  const createBlog = async (blog) => {
    let success = true
    try {
      await blogService.create(blog)
      blogFormRef.current.toggleVisibility()
      showMsg(`A new blog ${blog.title} by ${blog.author} added`, 'green')
    } catch (exception) {
      success = false
      showMsg(`A new blog ${blog.title} by ${blog.author} was not added`, 'red')
    }
    await refreshBlogs()
    return success
  }


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      refreshBlogs()
    }
  }, [])

  const refreshBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove ${blog.id} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      await refreshBlogs()
    }
  }

  const updateBlog = async (blog) => {
    await blogService.update(blog.id, blog)
    await refreshBlogs()
  }

  const loginForm = () => (
    <form id='login-form' onSubmit={handleLogin}>
      <div>
        username
        <input
          id='login-username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='login-password'
          type="text"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-login' type="submit">login</button>
    </form>
  )

  return (
    <div>
      <Notification msg={msg} color={msgColor}></Notification>

      {user && <div>
        <form onSubmit={handleLogout}>
          <p>{user.username} logged in
            <button type="submit">logout</button>
          </p>
        </form>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog}/>
        </Togglable>

        <h2>blogs</h2>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} removeBlog={removeBlog} updateBlog={updateBlog} user={user}/>
        )}
      </div>
      }
      {!user && loginForm()}
    </div>
  )
}

export default App