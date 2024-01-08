import { v4 as uuidv4 } from 'uuid';

let todos = [
  { id: '1', title: 'express', completed: true },
  { id: '2', title: 'node', completed: true },
  { id: '3', title: 'app', completed: false },
];

export const getAll = () => {
  return todos;
};

export const getById = (id) => {
  return todos.find((todo) => todo.id === id) || null;
};

export const create = (title) => {
  const id = uuidv4();
  const todo = {
    id,
    title,
    completed: false,
  };
  todos.push(todo);
  return todo;
};

export const update = ({ id, title, completed }) => {
  const todo = getById(id);

  Object.assign(todo, { title, completed });

  return todo;
};

export const deleteTodo = (id) => {
  todos = todos.filter((todos) => todos.id !== id);
};

export const deleteManyTodos = (ids) => {
  todos = todos.filter((todo) => !ids.includes(todo.id));
};

export const updateManyTodos = (items) => {

  items.forEach((item) => {
    const { id, title, completed } = item;
    const curentTodo = getById(id)
    if (curentTodo) {
      Object.assign(curentTodo, { completed, title });
    }
  });
};
