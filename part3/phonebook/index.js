const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('posting', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :posting'))

let people = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(people)
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {return response.status(400).json({ error: 'name missing' })}
  if (!body.number) {return response.status(400).json({ error: 'number missing' })}
  if (people.find(x => x.name === body.name)) {return response.status(400).json({ error: 'name must be unique' })}

  const person = {
    id: Math.floor(Math.random()*1000),
    name: body.name,
    number: body.number
  }
  people.push(person);
  response.json(person);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = people.find(x => x.id === id);
  if (person)
    response.json(person)
  else
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  people = people.filter(x => x.id !== id);
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
