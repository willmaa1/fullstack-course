const blogsRouter = require('express').Router()
const Blog = require("../models/blog")
const User = require("../models/user")


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate("user", { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user

  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog || !user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'Cannot delete blogs that are not yours' })
  }

  await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    // Note: (Exercise 5.9) I was unsure what was meant by "The backend has to be updated too to handle the user reference."
    // Below are two versions, one uses the user id that was passed in with the updated blog
    // while the other updates the bloguser to be the currently active user.
    user: await User.findById(body.user.id)
    // user: user
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
  response.json(result)
})

module.exports = blogsRouter