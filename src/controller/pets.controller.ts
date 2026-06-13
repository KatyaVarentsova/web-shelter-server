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

  async createPet(req: Request, res: Response) {
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
      curator_id
    } = req.body;

    try {
      const result = await pool.query(
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
          curator_id
        ]
      );

      res.status(201).json(result.rows[0]);

    } catch (err: any) {
      res.status(500).json({
        error: err.message
      });
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

  async updatePet(req: Request, res: Response) {
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
      curator_id
    } = req.body;

    try {
      const result = await pool.query(
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
          id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Животное не найдено'
        });
      }

      res.json(result.rows[0]);

    } catch (err: any) {
      res.status(500).json({
        error: err.message
      });
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