import express from 'express';
import { uuid } from 'uuidv4';
import cors from 'cors';

const app = express();

let todos = [
  { id: '1', title: 'express', complited: true },
  { id: '2', title: 'node1', complited: true },
  { id: '3', title: 'app', complited: true },
];

app.use(cors());

app.get('/todos', (req, res) => {
  res.send(todos);
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;

  const todo = todos.find((todos) => todos.id === id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  res.send(todo);
});

app.delete('/todos/:id', express.json(), (req, res) => {
  const { id } = req.params;

  const newTodos = todos.filter((todos) => todos.id !== id);
  if (newTodos.length === todos.length) {
    res.sendStatus(404);
    return;
  }

  todos = newTodos;

  res.sendStatus(204);
});

app.post('/todos', express.json(), (req, res) => {
  const id = uuid();
  const title = req.body.title;
  console.log(req);

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = {
    id,
    title,
    complited: false,
  };
  todos.push(todo);
  res.statusCode = 201;
  res.send(todo);
});

app.put('/todos/:id', express.json(), (req, res) => {
  const {id} = req.params;
  const { title, complited } = req.body;

  const todo = todos.find((todos) => todos.id === id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }

  if (typeof title !== 'string' || typeof complited !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  Object.assign(todo, {title, complited});

  // res.statusCode = 201;
  res.send(todo);
});

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
