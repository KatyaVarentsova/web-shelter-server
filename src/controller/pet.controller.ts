import { Request, Response } from 'express';
import pool from '../config/db';

class PetsController {
  async getPets(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM pets');
      res.json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createPet(req: Request, res: Response) {
    const {
      type,
      weight,
      character,
      age,
      gender,
      fur,
      description,
      images,
      status,
      health
    } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO pets 
      (type, weight, character, age, gender, fur, description, images, status, health)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::text[],$9,$10)
      RETURNING *`,
        [type, weight, character, age, gender, fur, description, images, status, health]
      );

      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPetId(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await pool.query(
        'SELECT * FROM pets WHERE id = $1',
        [id]
      );

      res.json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePet(req: Request, res: Response) {
    const { id } = req.params;

    const {
      type,
      weight,
      character,
      age,
      gender,
      fur,
      description,
      images,
      status,
      health
    } = req.body;

    try {
      const result = await pool.query(
        `UPDATE pets SET
        type = $1,
        weight = $2,
        character = $3,
        age = $4,
        gender = $5,
        fur = $6,
        description = $7,
        images = $8::text[],
        status = $9,
        health = $10
      WHERE id = $11
      RETURNING *`,
        [
          type,
          weight,
          character,
          age,
          gender,
          fur,
          description,
          images,
          status,
          health,
          id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Животное не найдено' });
      }

      res.json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async deletePet(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await pool.query('DELETE FROM pets WHERE id = $1', [id]);
      res.json({ message: 'Удалено' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new PetsController();