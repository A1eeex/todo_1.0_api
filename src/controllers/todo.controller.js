import * as todoService from '../services/todo.services.js';

export const get = async (req, res) => {
  try {
    const todosData = await todoService.getAll();
    res.send(todosData);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

export const getOne = async (req, res) => {
  const { id } = req.params;

  const todo = await todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  res.send(todo);
};

export const create = async (req, res) => {
  const title = req.body.title;

  if (!title) {
    res.sendStatus(422);
    return;
  }

  const todo = await todoService.createTodo(title);
  res.statusCode = 201;
  res.send(todo);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = await todoService.getById(id);
  if (!todo) {
    res.sendStatus(404);
    return;
  }

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    res.sendStatus(422);
    return;
  }

  const updatetdTodo = await todoService.update({ id, title, completed });

  res.send(updatetdTodo);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const getTodo = await todoService.getById(id);
  if (!getTodo) {
    res.sendStatus(404);
    return;
  }

  todoService.deleteTodo(id);

  res.sendStatus(204);
};

export const removeMany = async (req, res) => {
  const { ids } = req.body;
  const getTodo = async (todoId) => await todoService.getById(todoId);
  if (!Array.isArray(ids)) {
    res.sendStatus(422);
    return;
  }

  if (!ids.every(async (id) => await getTodo(id))) {
    throw new Error();
  }

  await todoService.deleteManyTodos(ids);

  res.sendStatus(204);
  return;
};

export const updateMany = async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.sendStatus(422);
    return;
  }

  const errors = [];
  const results = [];

  const updateItem = async (item) => {
    const { id, title, completed } = item;

    const curentTodo = await todoService.getById(id);

    if (!curentTodo) {
      errors.push({ id, title, completed, error: 'Not found' });
    } else {
      const result = await todoService.update({ id, title, completed });
      results.push(result);
    }
  };
  for (const item of items) {
    await updateItem(item);
  }
  res.status(200).json({ errors, results });

  return;
};
