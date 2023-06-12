import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState(null)
  const [msgColor, setMsgColor] = useState(null)

  const showMsg = (msg, color) => {
    setMsg(msg)
    setMsgColor(color)
    setTimeout(() => { setMsg(null); }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        "loggedBloglistUser", JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
      showMsg("Logged in", "green");

    } catch (exception) {
      showMsg("Wrong credentials", "red");
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    
    window.localStorage.removeItem(
      "loggedBloglistUser", JSON.stringify(user)
    )
    setUser(null)
    showMsg("Logged out", "green")
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      await blogService.create({title, author, url})
      showMsg(`A new blog ${title} by ${author} added`, "green")
    } catch (exception) {
      showMsg(`A new blog ${title} by ${author} was not added`, "red")
    }
    await refreshBlogs()
  }


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const refreshBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }
  
  useEffect(() => {
    refreshBlogs()
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
        type="text"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={handleCreateBlog}>
      <div>
        title:
        <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Create</button>
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
        {blogForm()}
      
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
      }
      {!user && loginForm()}
    </div>
  )
}

export default App