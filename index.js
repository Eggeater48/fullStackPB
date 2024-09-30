const express = require('express')

const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', request => {
	return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Users = require('./models/Numbers')

const unknownEndPoint = (request, response) => {
	response.status(404).send({ error : 'Unknown EndPoint' })
}

const errorHandler = (error, request, response, next) => {
 	console.error(error)

	if (error.name === 'CastError') {
		return response.status(400).send({ error : 'malformatted id' })
	}
	next(error)
}

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
	Users.findByIdAndDelete(request.params.id, () => {

	})
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	const number = new Users({
		name : body.name,
		number : body.number
	})

	number.save().then(savedNumber => {
		response.status(201).json(savedNumber)
	}).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	Users.findByIdAndUpdate(request.params.id, request.body).then(() => {
		response.status(200).end()
	}).catch(error => next(error))
})

app.use(unknownEndPoint)
app.use(errorHandler)

app.listen(3000, '0.0.0.0')
