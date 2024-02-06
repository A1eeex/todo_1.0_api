import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('todo_database', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
  });