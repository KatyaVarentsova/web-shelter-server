import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import petsRoutes from './routes/pet.routes'; 
import pool from './config/db';
import { initDb } from './database/initDb';

const app = express();
app.use(cors());
app.use(bodyParser.json());

pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Ошибка подключения к базе данных', err.stack);
  } else {
    console.log('Подключено к базе данных:', res.rows);
  }
});

initDb();
app.use('/api', petsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));