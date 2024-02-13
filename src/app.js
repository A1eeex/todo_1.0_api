import express from 'express';
import cors from 'cors';
import { router as todoRouter } from './routes/todo.route.js';
import dotenv from 'dotenv';
import { sequelize } from './services/db.js';

dotenv.config();
const app = express();
// const PORT = 3005;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  })


app.use(cors({
  origin:process.env.CLIENT_ORIGIN,
}));
app.use('/', express.json(), todoRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀🚀🚀`);
});
