import { Request, Response } from 'express';
import pool from '../config/db';

class MessengersController {
    async createMessenger(req: Request, res: Response) {
        const {
            curator_id,
            messenger,
            nickname
        } = req.body;

        if (!curator_id || !messenger || !nickname) {
            return res.status(400).json({
                error: 'Все поля обязательны'
            });
        }

        try {
            const result = await pool.query(
                `
                INSERT INTO messengers (
                    curator_id,
                    messenger,
                    nickname
                )
                VALUES ($1, $2, $3)
                RETURNING *   
                `,
                [
                    curator_id,
                    messenger,
                    nickname
                ]
            );
            res.status(201).json(result.rows[0]);
        }
        catch (err: any) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    async deleteMessenger(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const result = await pool.query(
                `
                DELETE FROM messengers
                WHERE id = $1
                RETURNING *
                `,
                [id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Мессенджер не найден'
                });
            }
            res.json({ message: 'Удалено' });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }
}

export default new MessengersController();