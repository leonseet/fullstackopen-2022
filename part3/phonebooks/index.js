const express = require('express')
const morgan = require("morgan")
const cors = require('cors')


const app = express()
const morganLogger = morgan((tokens, req, res) => { // morganLogger initialization
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
})

app.use(express.json())
app.use(express.static('build'))
app.use(morganLogger)
app.use(cors())

persons = [
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


app.get('/api/persons', (request, response) => {
    response.json(persons)
  })


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
    response.json(person)
    } else {
    response.status(404).end()
    }
})


app.get('/info', (request, response) => {
    response.send(`<div>
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
    </div>`)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})


const generateId = () => {
  return Math.floor(Math.random() * 999999);
}

app.post('/api/persons', (request, response) => {
const body = request.body

if (!body) {
  return response.status(400).json({ 
    error: 'content missing' 
  })
}

if (!body.name || !body.number) {
  return response.status(400).json({
    error: "missing name or number"
  })
}

const nameExist = (x) => x.name === body.name

if (persons.some(nameExist)) {
  return response.status(400).json({
    error: "name must be unique"
  })
}

const person = {
  id: generateId(),
  name: body.name,
  number: body.number
}

persons = persons.concat(person)

response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
