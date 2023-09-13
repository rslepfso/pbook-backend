const express = require("express");
const cors = require("cors");

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

app.get("/", (request, response) => {
  response.send("<h1>Home Page</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

app.post("/api/persons", (request, response) => {
  const person = request.body;
  person.id = Math.random() * 1000;

  if (!person.name) {
    return response.status(400).json({
      error: "Name is missing",
    });
  }

  if (!person.number) {
    return response.status(400).json({
      error: "Number is missing",
    });
  }

  const duplicates = persons.filter(
    (p) => p.name.toLowerCase() === person.name.toLowerCase()
  );

  if (duplicates.length > 0) {
    return response.status(400).json({
      error: "Name is already exists",
    });
  } else {
    persons = persons.concat(person);
    response.json(person);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
