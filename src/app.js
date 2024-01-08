import express from 'express';
import cors from 'cors';
import * as todoService from './services/todo.services.js';
const app = express();

let todos = [
  { id: '1', title: 'express', completed: true },
  { id: '2', title: 'node', completed: true },
  { id: '3', title: 'app', completed: false },
];

app.use(cors());

app.patch('/todos', express.json(), (req, res) => {
  const search = req.query;
  const { ids, items } = req.body;

  if (search.action === 'delete') {
    if (!Array.isArray(ids)) {
      res.sendStatus(422);
      return;
    }

    todoService.deleteManyTodos(ids)

    res.sendStatus(204);
    return;
  }

  if (search.action === 'update') {
    if (!Array.isArray(items)) {
      res.sendStatus(422);
      return;
    }
    todoService.updateManyTodos(items)

    res.sendStatus(204);
    return;
  }

  res.sendStatus(422);
});

app.get('/todos', (req, res) => {
  res.send(todoService.getAll());
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;

  const todo = todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  res.send(todo);
});

app.delete('/todos/:id', express.json(), (req, res) => {
  const { id } = req.params;

  if (!todoService.getById(id)) {
    res.sendStatus(404);
    return;
  }

  todoService.deleteTodo(id);
  
  res.sendStatus(204);
});

app.post('/todos', express.json(), (req, res) => {
  const title = req.body.title;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = todoService.create(title);
  res.statusCode = 201;
  res.send(todo);
});

app.put('/todos/:id', express.json(), (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  const updatetdTodo = todoService.update({ id, title, completed });

  res.send(updatetdTodo);
});

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
