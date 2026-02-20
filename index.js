const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "id" : "1",
    "name" : "Arto Hellas",
    "number" : "040-123456"
  },
  {
    "id" : "2",
    "name" : "Ada Lovelace",
    "number" : "39-445323523"
  },
  {
    "id" : "3",
    "name" : "Dan Abramov",
    "number" : "12-43-234345"
  },
  {
    "id" : "4",
    "name" : "Mary Poppendieck",
    "number" : "39-23-6423122"
  },
]



app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  people = persons.length
  requestTime = new Date();

  response.send(`<p>Phonebook has ${people} people</p> <p>${requestTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) { //if the person was found
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

const generateRandom = () => {
  return String(Math.floor(Math.random() * 1000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number missing'
    })
  }

  const person = {
    id: generateRandom(),
    name: body.name,
    number: body.number
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(403).json({
      error: `${person.name} is already in the phonebook`
    })
  }
  
  persons = persons.concat(person)
  response.json(person)

})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)