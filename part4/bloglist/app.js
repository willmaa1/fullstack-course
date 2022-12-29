const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const middleware = require('./utils/middleware')

// Mongoose `strictQuery` option will be switched to `false` by default in Mongoose 7.
mongoose.set('strictQuery', false)
mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())

app.use("/api/blogs", blogsRouter)

app.use(middleware.errorHandler)

module.exports = app