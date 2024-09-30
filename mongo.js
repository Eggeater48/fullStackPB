
const mongoose = require('mongoose')

const password = encodeURIComponent(process.argv[2])
const URL =
	``

mongoose.set('strictQuery', false)
mongoose.connect(URL)

const schema = new mongoose.Schema({
	name : String,
	number : String
})

const User = mongoose.model('User', schema)

const newUser = new User({
	name : process.argv[3],
	number : process.argv[4]
})

if (process.argv.length === 3) {
	User
		.find({}).then(result => {
			console.log('phoneBook: ')
			result.forEach(phoneNumber => {
			console.log(phoneNumber.name, phoneNumber.number)
		})
			mongoose.connection.close()
		})
} else {
	newUser.save()
		.then(() => {
			mongoose.connection.close().then(() => {
				console.log(`Added ${process.argv[3]} ${process.argv[4]} to phonebook`)
			})
		})
}

