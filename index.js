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

app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${persons.length} people<p>
  <p>Current time is ${new Date().toLocaleString()}
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
