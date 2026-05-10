import { Request, Response } from 'express';
import pool from '../config/db';

class PetImagesController {
    async getPetImages(req: Request, res: Response) {
        try {
            const result = await pool.query('SELECT * FROM pet_images');
            res.json(result.rows);
        }
        catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    async createPetImage(req: Request, res: Response) {
        const {
            pet_id,
            image,
            number
        } = req.body;

        if (!pet_id || !image || !number) {
            return res.status(400).json({
                error: 'Все поля обязательны'
            });
        }

        try {
            const result = await pool.query(
                `
                INSERT INTO pet_images (
                    pet_id,
                    image,
                    number
                )
                VALUES (
                    $1, $2, $3
                )
                    RETURNING *
                `,
                [
                    pet_id,
                    image,
                    number
                ]
            );
            res.status(201).json(result.rows[0]);
        } catch (err: any) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    async updatePetImage(req: Request, res: Response) {
        const { id } = req.params;

        const {
            pet_id,
            image,
            number
        } = req.body;

        try {
            const result = await pool.query(
                `
                UPDATE pet_images
                SET
                    pet_id = $1,
                    image = $2,
                    number = $3
                WHERE id = $4
                RETURNING *
                `,
                [
                    pet_id,
                    image,
                    number,
                    id
                ]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Изображение животного не найдено'
                });
            }
            res.status(200).json(result.rows[0]);
        } catch (err: any) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    async deletePetImage(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const result = await pool.query(
                `
                DELETE FROM pet_images
                WHERE id = $1
                RETURNING *
                `,
                [id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Изображение не найдено'
                });
            }
            res.json({ message: 'Удалено' });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}

export default new PetImagesController();