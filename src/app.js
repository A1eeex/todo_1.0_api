import express from 'express';
import cors from 'cors';
import { router as todoRouter } from './routes/todo.route.js';

const app = express();

app.use(cors());
app.use('/', express.json(), todoRouter);

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
