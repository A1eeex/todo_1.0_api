import { sequelize } from './db.js';
import { DataTypes, Op } from 'sequelize';

// let todos = [
//   { id: '1', title: 'express', completed: true },
//   { id: '2', title: 'node', completed: true },
//   { id: '3', title: 'app', completed: false },
// ];

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
  try {
    const todos_data = await Todo.findAll();
    return todos_data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error; // Прокинути помилку далі, щоб забезпечити її обробку у вищих рівнях додатку
  }
};

export const getById = async (id) => {
  try {
    return await Todo.findByPk(id);
  } catch (error) {
    console.error(`Error fetching todo with id ${id}:`, error);
    throw error;
  }
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
  await Todo.destroy({
    where: {
      id,
    },
  });
};

export const deleteManyTodos = async (ids) => {
  await Todo.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
};
