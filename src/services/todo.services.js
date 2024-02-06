import { v4 as uuidv4 } from 'uuid';
import { sequelize } from './db.js';
import { DataTypes, Op } from 'sequelize';

let todos = [
  { id: '1', title: 'express', completed: true },
  { id: '2', title: 'node', completed: true },
  { id: '3', title: 'app', completed: false },
];

const Todo = sequelize.define(
  'Todo',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'todos',
    updatedAt: false,
    createdAt: false,
  }
);

export const getAll = async () => {
  const todos_data = await Todo.findAll();
  return todos_data;
};

export const getById = async (id) => {
  return Todo.findByPk(id);
  // return todos.find((todo) => todo.id === id) || null;
};

export const createTodo = async (title) => {
  const createTodo = await Todo.create({
    title,
  });

  return createTodo;
};

export const update = async ({ id, title, completed }) => {
  await Todo.update(
    { title, completed },
    {
      where: {
        id,
      },
    }
  );

  const todo = getById(id);

  Object.assign(todo, { title, completed });

  return todo;
};

export const updateManyTodos = async (items) => {
  // const transaction = sequelize.transaction();

  return sequelize.transaction(async (t) => {
    for (const { id, title, completed } of items) {
      await Todo.update(
        { title, completed },
        {
          where: { id },
          transaction: t,
        }
      );
    }
  });

  // await Todo.bulkCreate(items, {
  //   updateOnDuplicate: ['title', 'completed'],
  // });

  //  const updateItems = async (item) => {
  //     const { id, title, completed } = item;
  //     const curentTodo = getById(id);
  //     if (curentTodo) {
  //       Object.assign(curentTodo, { completed, title });
  //     }
  //   };

  //   for (const item of items) {
  //     await updateItems(item);
  //   }
};

export const deleteTodo = async (id) => {
  // todos = todos.filter((todos) => todos.id !== id);

  await Todo.destroy({
    where: {
      id,
    },
  });
};

export const deleteManyTodos = async (ids) => {
  // todos = todos.filter((todo) => !ids.includes(todo.id));
  await Todo.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
};
