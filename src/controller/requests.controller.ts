import { NextFunction, Request, Response } from 'express';
import pool from '../config/db';

class RequestsController {
    async getRequests(req: Request, res: Response) {
        try {
            const result = await pool.query(`
            SELECT 
                r.id,
                r.status,
                r.name,
                r.comment,
                r.pet_id,
                p.nickname AS pet_nickname,
                r.contact,
                r.by_phone,
                r.on_messenger
            FROM requests r
            LEFT JOIN pets p ON p.id = r.pet_id
            ORDER BY r.created_at DESC
        `);

            return res.status(200).json(result.rows);
        } catch (err: any) {
            return res.status(500).json({
                error: err.message
            });
        }
    }

    async createRequest(req: Request, res: Response) {
        const {
            curator_id,
            pet_id,
            name,
            contact,
            by_phone,
            on_messenger,
            comment
        } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({
                error: "Имя обязательно"
            });
        }

        if (!contact?.trim()) {
            return res.status(400).json({
                error: "Контактные данные обязательны"
            });
        }

        if (!by_phone && !on_messenger) {
            return res.status(400).json({
                error: "Укажите хотя бы один способ связи"
            });
        }

        try {
            const result = await pool.query(
                `
                INSERT INTO requests (
                    curator_id,
                    pet_id,
                    name,
                    contact,
                    by_phone,
                    on_messenger,
                    comment
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING *
                `,
                [
                    curator_id,
                    pet_id,
                    name,
                    contact,
                    by_phone,
                    on_messenger,
                    comment
                ]
            );

            return res.status(201).json(result.rows[0]);
        } catch (err: any) {
            return res.status(500).json({
                error: err.message
            });
        }
    }

    async deleteRequest(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const result = await pool.query(
                'DELETE FROM requests WHERE id = $1',
                [id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    error: 'Заявка не найдена',
                });
            }
            return next();
        } catch (err: any) {
            return res.status(500).json({
                error: err.message,
            });
        }
    }
}

export default new RequestsController();