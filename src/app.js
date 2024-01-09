import express from 'express';
import cors from 'cors';
import * as todoService from './services/todo.services.js';
import * as todoController from './controllers/todo.controller.js';
const app = express();

app.use(cors());

app.get('/todos', cors(), todoController.get);

app.get('/todos/:id', todoController.getOne);

app.delete('/todos/:id', express.json(), todoController.remove);

app.post('/todos', express.json(), todoController.create);

app.put('/todos/:id', express.json(), todoController.update);

app.patch('/todos', express.json(), (req, res) => {
  const search = req.query;
  const { ids, items } = req.body;

  if (search.action === 'delete') {
    if (!Array.isArray(ids)) {
      res.sendStatus(422);
      return;
    }

    if (!ids.every((id) => todoService.getById(id))) {
      throw new Error();
    }

    todoService.deleteManyTodos(ids);

    res.sendStatus(204);
    return;
  }

  if (search.action === 'update') {
    if (!Array.isArray(items)) {
      res.sendStatus(422);
      return;
    }

    const errors = [];
    const results = [];

    items.forEach((item) => {
      const { id, title, completed } = item;

      const curentTodo = todoService.getById(id);

      if (!curentTodo) {
        errors.push({ id, title, completed, error: 'Not found' });
      } else {
        const result = todoService.update({ id, title, completed });
        results.push(result);
      }
    });
    res.status(200).json({ errors, results });

    return;
  }

  res.sendStatus(422);
});

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
