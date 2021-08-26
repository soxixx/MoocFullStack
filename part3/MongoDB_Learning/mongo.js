const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const num = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.kuf4e.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Element = mongoose.model('Element', personSchema)

const element = new Element({
  name: `${name}`,
  number: `${num}`,
})

if (process.argv.length === 3) {
  Element.find({}).then(result => {
    result.forEach(element => {
      console.log(`${element.name} ${element.number}`)
    })
    process.exit(0)
  })
}

element.save().then(result => {
  console.log(`added ${name} number ${num} to phonebook`)
  mongoose.connection.close()
})
