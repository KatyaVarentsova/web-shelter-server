import pool from '../config/db';

export const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pets (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        weight INT,
        character VARCHAR(20),
        age INT,
        gender VARCHAR(20),
        fur VARCHAR(20),
        description TEXT,
        images TEXT[],
        status VARCHAR(50),
        health VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Таблица pets готова');
  } catch (err) {
    console.error('❌ Ошибка создания таблицы', err);
  }
};