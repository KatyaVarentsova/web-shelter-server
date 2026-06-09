import fs from 'fs';
import path from 'path';

import pool from '../config/db';

export const initDb = async () => {
  try {

    const migrations = [
      '001_create_curators.sql',
      '002_create_pets.sql',
      '003_create_pet_images.sql',
      '004_create_pet_stories.sql',
      '005_create_requests.sql',
      '006_create_messengers.sql'
    ];

    for (const file of migrations) {
      const sqlPath = path.join(
        __dirname,
        'migrations',
        file
      );
      const sql = fs.readFileSync(sqlPath, 'utf-8');
      await pool.query(sql);
      console.log(`✅ Выполнен ${file}`);
    }

    console.log('✅ База данных готова');

  } catch (err) {
    console.error('❌ Ошибка инициализации БД', err);
  }
};