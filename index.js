require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Person = require("./modules/person");

const morgan = require("morgan");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(morgan(":body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// ROUTE HANDLERS
app.get("/", (request, response) => {
  response.send("<h1>Home Page</h1>");
});

// Get all
app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => response.json(result));
});

// Get info
app.get("/info", (request, response) => {
  Person.find({}).then((result) => {
    response.send(`
  <p>Phonebook has info for ${result.length} people<p>
  <p>Current time is ${new Date().toLocaleString()}
  `);
  });
});

// Get single person
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

// Delete person
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Create new
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "Number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    response.json(result);
  });

  // const duplicates = persons.filter(
  //   (p) => p.name.toLowerCase() === body.name.toLowerCase()
  // );

  // if (duplicates.length > 0) {
  //   return response.status(400).json({
  //     error: "Name is already exists",
  //   });
  // } else {
  //   persons = persons.concat(body);
  //   response.json(body);
  // }
});

// Update person
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
