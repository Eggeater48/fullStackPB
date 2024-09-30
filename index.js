const express = require('express')

const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Users = require('./models/Numbers')

morgan.token('body', request => {
	return JSON.stringify(request.body)
})

const errorHandler = (error, request, response, next) => {
	console.error(error)

	if (error.name === 'CastError') {
		return response.status(400).send({ error : 'malformatted id' })
	}
	next(error)
}

const unknownEndPoint = (request, response) => {
	response.status(404).send({ error : 'Unknown EndPoint' })
}

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
	Users.find({}).then(result => {
		response.json(result)
	})
})

app.get('/info', (request, response) => {
	Users.find({}).then(phoneNumbers => {
		response.send(`<p>PhoneBook has info for ${phoneNumbers.length} people</p> <p>${new Date()}</p>`)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Users.findById(request.params.id)
		.then(number => {
			if (number) {
				response.json(number)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Users.findByIdAndDelete(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.hasOwnProperty('name')) { // Very ugly block 🐸
		return response.status(400).send( { error : 'name is missing' })
	} else if (!body.hasOwnProperty('number')) {
		return response.status(400).send({ error : 'number is missing' })
	} else {
		const number = new Users({
			name : body.name,
			number : body.number
		})

		number.save().then(savedNumber => {
			response.status(201).json(savedNumber)
		})
	}
})

app.put('/api/persons/:id', (request, response, next) => {

})

app.use(unknownEndPoint)
app.use(errorHandler)

app.listen(3000, '0.0.0.0')