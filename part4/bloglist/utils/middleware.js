const errorHandler = (error, request, response, next) => {
  // console.error("error message incoming")
  // console.error(error.name)
  // console.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "MongoServerError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = { errorHandler }