import { Request, Response } from 'express';
import pool from '../config/db';

class CuratorsController {
    async getCurators(req: Request, res: Response) {
        try {
            const result = await pool.query(`
                SELECT
                curators.*,
                COALESCE(
                    json_agg(
                    json_build_object(
                        'id', messengers.id,
                        'messenger', messengers.messenger,
                        'nickname', messengers.nickname
                        )
                    ) FILTER (
                    WHERE messengers.id IS NOT NULL
                    ),
                    '[]'
                ) AS messengers
                FROM curators
                LEFT JOIN messengers
                    ON curators.id = messengers.curator_id
                    GROUP BY curators.id
                `);
            res.json(result.rows);
        }
        catch (err: any) {
            res.status(500).json({ error: err.message })
        }
    }

    async createCurator(req: Request, res: Response) {
        const {
            last_name,
            first_name,
            middle_name,
            description,
            image,
            birthday,
            phone_number,
            nickname
        } = req.body;

        try {
            const result = await pool.query(
                `
                INSERT INTO curators (
                    last_name,
                    first_name,
                    middle_name,
                    description,
                    image,
                    birthday,
                    phone_number,
                    nickname
                )
                VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8
                )
                RETURNING *
                `,
                [
                    last_name,
                    first_name,
                    middle_name,
                    description,
                    image,
                    birthday,
                    phone_number,
                    nickname
                ]
            );

            res.status(201).json(result.rows[0]);

        } catch (err: any) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    async getCuratorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const result = await pool.query(`
                SELECT
                curators.id,
                curators.last_name,
                curators.first_name,
                curators.description,
                curators.image,
                curators.phone_number,
                COALESCE(
                    json_agg(
                    json_build_object(
                        'id', messengers.id,
                        'messenger', messengers.messenger,
                        'nickname', messengers.nickname
                        )
                    ) FILTER (
                    WHERE messengers.id IS NOT NULL
                    ),
                    '[]'
                ) AS messengers
                FROM curators
                LEFT JOIN messengers
                    ON curators.id = messengers.curator_id
                    WHERE curators.id = $1
                    GROUP BY curators.id
                `,
                [id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Куратор не найден'
                });
            }
            res.json(result.rows[0]);
        }
        catch (err: any) {
            res.status(500).json({ error: err.message })
        }
    }
}

export default new CuratorsController();