const mongoose = require("mongoose");

const URL = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(URL)
	.then(result => {
		console.log('Connected to the DB')
	})
	.catch((error) => {
		console.log('error : ', error.message)
	})

const userSchema = new mongoose.Schema({
	name : String,
	number : String
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Users', userSchema)