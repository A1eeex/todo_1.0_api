import express from 'express';
import * as todoController from '../controllers/todo.controller.js';

const router = express.Router();

router.get('/todos', todoController.get);

router.get('/todos/:id', todoController.getOne);

router.delete('/todos/:id', todoController.remove);

router.post('/todos', todoController.create);

router.put('/todos/:id', todoController.update);

router.patch('/todos', (req, res) => {
  const search = req.query;

  if (search.action === 'delete') {
    todoController.removeMany(req, res);
    return;
  }

  if (search.action === 'update') {
    todoController.updateMany(req, res);
    return;
  }

  res.sendStatus(422);
});

export { router };
