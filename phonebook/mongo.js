const mongoose = require('mongoose')



if (process.argv.length < 3) {
  console.log('Insert password')
  process.exit(1)
}


const password = process.argv[2]

const url = `mongodb+srv://jonwl:${password}@cluster0.q7x4vrc.mongodb.net/people?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(
      `Added ${result.name} number: ${result.number} to the phonebook`
    )
    mongoose.connection.close()
  })
}





