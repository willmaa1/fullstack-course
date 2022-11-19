require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

morgan.token("posting", function (req) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :posting"))

const Person = require("./models/person")

// let people = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.get("/info", (request, response) => {
  Person.find({}).then(people => {
    response.send(`<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`)
  })
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  // Handling these errors here is clearer and so have not moved them to the error handling middleware
  // if (!body.name) {return response.status(400).json({ error: "name missing" })}
  // if (!body.number) {return response.status(400).json({ error: "number missing" })}
  // if (people.find(x => x.name === body.name)) {return response.status(400).json({ error: "name must be unique" })}

  const person = {
    name: body.name,
    number: body.number
  }
  const pers = new Person(person)
  pers.save()
    .then(result => {
      console.log("saved")
      response.json(result)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person)
        response.json(person)
      else
        response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error("error message incoming")
  console.error(error.name)
  console.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "MongoServerError") {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
