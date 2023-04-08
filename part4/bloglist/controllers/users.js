const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require("../models/user")

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate("blogs", { title: 1, url: 1, author: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: "password should be at least 3 characters long."
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const result = await user.save()

  response.status(201).json(result)
})


// As this is only an exercise I've created an easy way to delete users for testing
usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

module.exports = usersRouter
