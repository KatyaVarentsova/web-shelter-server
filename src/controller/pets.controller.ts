import { NextFunction, Request, Response } from 'express';
import pool from '../config/db';

class PetsController {
  async getPets(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT
          pets.id,
          pets.nickname,
          pets.category,
          pets.birthday,
          pets.gender,
          pet_images.image
        FROM pets
        LEFT JOIN pet_images
          ON pets.id = pet_images.pet_id
          AND pet_images.number = 1
        `);
      res.json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async postPetsByFilter(req: Request, res: Response) {
    const {
        type,
        size,
        character,
        age,
        gender,
        wool,
        other,
    } = req.body;

    try {
        let query = `
            SELECT
                pets.id,
                pets.nickname,
                pets.category,
                pets.birthday,
                pets.gender,
                pet_images.image
            FROM pets
            LEFT JOIN pet_images
                ON pets.id = pet_images.pet_id
                AND pet_images.number = 1
            WHERE 1 = 1
        `;

        const values: any[] = [];
        let index = 1;

        if (type) {
            query += ` AND pets.category = $${index++}`;
            values.push(type);
        }

        if (character) {
            query += ` AND pets.character = $${index++}`;
            values.push(character);
        }

        if (gender) {
            query += ` AND pets.gender = $${index++}`;
            values.push(gender);
        }

        if (wool) {
            query += ` AND pets.wool = $${index++}`;
            values.push(wool);
        }

        // Размер
        if (size === 'До 10 кг') {
            query += ` AND pets.size <= $${index++}`;
            values.push(10);
        }

        if (size === 'От 10 до 30 кг') {
            query += ` AND pets.size >= $${index++} AND pets.size <= $${index++}`;
            values.push(10, 30);
        }

        if (size === 'От 30 кг') {
            query += ` AND pets.size >= $${index++}`;
            values.push(30);
        }

        // Возраст
        if (age) {
            const today = new Date();

            if (age === 'До 1 года') {
                const date = new Date(today);
                date.setFullYear(date.getFullYear() - 1);

                query += ` AND pets.birthday >= $${index++}`;
                values.push(date);
            }

            if (age === 'От 1 года до 5 лет') {
                const max = new Date(today);
                max.setFullYear(max.getFullYear() - 1);

                const min = new Date(today);
                min.setFullYear(min.getFullYear() - 5);

                query += ` AND pets.birthday BETWEEN $${index++} AND $${index++}`;
                values.push(min, max);
            }

            if (age === 'От 5 лет до 10 лет') {
                const max = new Date(today);
                max.setFullYear(max.getFullYear() - 5);

                const min = new Date(today);
                min.setFullYear(min.getFullYear() - 10);

                query += ` AND pets.birthday BETWEEN $${index++} AND $${index++}`;
                values.push(min, max);
            }

            if (age === 'Старше 10 лет') {
                const date = new Date(today);
                date.setFullYear(date.getFullYear() - 10);

                query += ` AND pets.birthday <= $${index++}`;
                values.push(date);
            }
        }

        // Чекбоксы
        if (other?.includes('Для семьи с детьми')) {
            query += ` AND pets.for_family = true`;
        }

        if (other?.includes('Ладит с собаками')) {
            query += ` AND pets.for_dogs = true`;
        }

        if (other?.includes('Ладит с кошками')) {
            query += ` AND pets.for_cats = true`;
        }

        if (other?.includes('На передержке')) {
            query += ` AND pets.is_guest = true`;
        }

        const result = await pool.query(query, values);

        return res.json(result.rows);

    } catch (err: any) {
        return res.status(500).json({
            error: err.message,
        });
    }
}

  async createPet(req: Request, res: Response, next: NextFunction) {
    const {
      nickname,
      category,
      size,
      character,
      birthday,
      gender,
      wool,
      for_family,
      for_dogs,
      for_cats,
      is_guest,
      description,
      curator_id,
      image_1,
      image_2,
      image_3,
      image_4,
      image_5,
    } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const petResult = await client.query(
        `
            INSERT INTO pets (
                nickname,
                category,
                size,
                character,
                birthday,
                gender,
                wool,
                for_family,
                for_dogs,
                for_cats,
                is_guest,
                description,
                curator_id
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
            )
            RETURNING *
            `,
        [
          nickname,
          category,
          size,
          character,
          birthday,
          gender,
          wool,
          for_family,
          for_dogs,
          for_cats,
          is_guest,
          description,
          curator_id,
        ]
      );

      const pet = petResult.rows[0];

      const images = [
        image_1,
        image_2,
        image_3,
        image_4,
        image_5,
      ];

      for (let i = 0; i < images.length; i++) {
        if (images[i] !== '') {
          await client.query(
            `
                INSERT INTO pet_images (
                    pet_id,
                    image,
                    number
                )
                VALUES (
                    $1,
                    $2,
                    $3
                )
                `,
            [
              pet.id,
              images[i],
              i + 1,
            ]
          );
        }
      }
      await client.query('COMMIT');
      return next();
    } catch (err: any) {
      await client.query('ROLLBACK');
      return res.status(500).json({
        error: err.message,
      });
    } finally {
      client.release();
    }
  }

  async getPetId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `
        SELECT
        pets.*,
          COALESCE(
            json_agg(
              json_build_object(
                'id', pet_images.id,
                'image', pet_images.image,
                'number', pet_images.number
                )
            ) FILTER (
            WHERE pet_images.id IS NOT NULL
            ),
            '[]'
          ) AS images
        FROM pets
        LEFT JOIN pet_images
            ON pets.id = pet_images.pet_id
            WHERE pets.id = $1
            GROUP BY pets.id
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Животное не найдено'
        });
      }

      res.json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePet(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const {
      nickname,
      category,
      size,
      character,
      birthday,
      gender,
      wool,
      for_family,
      for_dogs,
      for_cats,
      is_guest,
      description,
      curator_id,
      image_1,
      image_2,
      image_3,
      image_4,
      image_5,
    } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const petResult = await client.query(
        `
            UPDATE pets SET
                nickname = $1,
                category = $2,
                size = $3,
                character = $4,
                birthday = $5,
                gender = $6,
                wool = $7,
                for_family = $8,
                for_dogs = $9,
                for_cats = $10,
                is_guest = $11,
                description = $12,
                curator_id = $13
            WHERE id = $14
            RETURNING *
            `,
        [
          nickname,
          category,
          size,
          character,
          birthday,
          gender,
          wool,
          for_family,
          for_dogs,
          for_cats,
          is_guest,
          description,
          curator_id,
          id,
        ]
      );

      if (petResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Животное не найдено',
        });
      }

      const pet = petResult.rows[0];

      await client.query(
        `DELETE FROM pet_images WHERE pet_id = $1`,
        [id]
      );

      const images = [
        image_1,
        image_2,
        image_3,
        image_4,
        image_5,
      ];

      for (let i = 0; i < images.length; i++) {
        if (images[i] !== '') {
          await client.query(
            `
                    INSERT INTO pet_images (
                        pet_id,
                        image,
                        number
                    )
                    VALUES ($1, $2, $3)
                    `,
            [
              pet.id,
              images[i],
              i + 1,
            ]
          );
        }
      }
      await client.query('COMMIT');
      return next();
    } catch (err: any) {
      await client.query('ROLLBACK');
      return res.status(500).json({
        error: err.message,
      });
    } finally {
      client.release();
    }
  }

  async deletePet(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const result = await pool.query('DELETE FROM pets WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({
          error: 'Питомец не найден',
        });
      }
      return next();
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPetsDogs(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT
          pets.id,
          pets.nickname,
          pets.birthday,
          pets.gender,
          curators.last_name,
          curators.first_name
        FROM pets
        LEFT JOIN curators
          ON pets.curator_id = curators.id
        WHERE pets.category = 'Собака'
        `);
      res.json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPetsCats(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT
          pets.id,
          pets.nickname,
          pets.birthday,
          pets.gender,
          curators.last_name,
          curators.first_name
        FROM pets
        LEFT JOIN curators
          ON pets.curator_id = curators.id
        WHERE pets.category = 'Кошка'
        `);
      res.json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new PetsController();