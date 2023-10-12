require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require('cors')
const Person = require('./models/person');
const { default: mongoose } = require('mongoose');

 
morgan.token('content', (req) => JSON.stringify(req.body))

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :content")
);

app.use(express.json());
app.use(cors())
app.use(express.static('dist'))



let persons = [
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
    })
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id, person).then((person) =>
    response.json(person)
  )
  .catch(error => next(error))
}); 

app.get("/info", (request, response) => {
  const numOfPeople = persons.length;
  const time = new Date(new Date().getTime());
  response.send(`<p>The phonebook has info for ${numOfPeople} people</p>
    <p>${time}</p>`);
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => response.status(204).end())
  .catch(error => next(error))
  persons = persons.filter((person) => person.id !== id);
  console.log("deletion made");
});

app.post("/api/persons", (request, response) => {

  const body = request.body;

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "Person already exists",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
response.json(savedPerson);
  })
  
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
