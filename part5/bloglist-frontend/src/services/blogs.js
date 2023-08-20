import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newtoken) => {
  token = `Bearer ${newtoken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (blogId, blog) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/${blogId}`, blog, config)
  return response.data
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.data
}

export default { getAll, create, update, remove, setToken }