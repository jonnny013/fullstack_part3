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
  Person.findById(request.params.id).then((person) =>
    {if (person) {response.json(person)}
    else {response.status(404).end()}
  }
  )
  .catch(error => next(error))
}); 

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const numOfPeople = persons.length;
    const time = new Date(new Date().getTime());
    response.send(`<p>The phonebook has info for ${numOfPeople} people</p>
    <p>${time}</p>`);
  })
  
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => response.status(204).end())
  .catch(error => next(error))
  persons = persons.filter((person) => person.id !== id);
  console.log("deletion made");
});


app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body


  Person.findByIdAndUpdate(request.params.id, {name, number}, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post("/api/persons", (request, response, next) => {
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
  .catch(error => (next(error)))
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
