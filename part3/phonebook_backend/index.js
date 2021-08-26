require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Element = require('./models/element')
var morgan = require('morgan')

morgan.token('req_body', function (req,res) {
  return JSON.stringify(req.body)}
)

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req_body'))
app.use(cors())

app.get('/', (res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req,res) => {
  Element.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info',(req,res) => {
  Element.count({}).then(tot => {
    res.send(`<div>
    Phonebook has info for ${tot} people
    <div><p> ${new Date()}</p></div>
    </div>`)
  })
})

app.get('/api/persons/:id',(req,res,next) => {
  Element.findById(req.params.id)
    .then(element => {
      if (element) {res.json(element)}
      else {res.status(404).end()}
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Element.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res,next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const element = new Element({
    name: body.name,
    number: body.number
  })

  element
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(req,res,next) => {
  const body = req.body
  const element = {
    name: body.name,
    number: body.number
  }
  const opts = { runValidators: true , new: true, context: 'query' }
  Element.findByIdAndUpdate(req.params.id, element, opts)
    .then(updatedNote => {
      if (updatedNote) res.json(updatedNote)
      else res.status(404).send({ error: `${body.name} was already deleted from server` })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request,response, next) => {
  // console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT)
console.log(`Server running on port ${PORT}`)