import * as todoService from '../services/todo.services.js';

export const get = (req, res) => {
  res.send(todoService.getAll());
};

export const getOne = (req, res) => {
  const { id } = req.params;

  const todo = todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  res.send(todo);
};

export const create = (req, res) => {
  const title = req.body.title;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = todoService.create(title);
  res.statusCode = 201;
  res.send(todo);
};

export const update = (req, res) => {
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
};

export const remove = (req, res) => {
  const { id } = req.params;

  if (!todoService.getById(id)) {
    res.sendStatus(404);
    return;
  }

  todoService.deleteTodo(id);

  res.sendStatus(204);
};
