import { Request, Response } from 'express';
import pool from '../config/db';

class CuratorsController {
    async getCurators(req: Request, res: Response) {
        try {
            const result = await pool.query('SELECT * FROM curators');
            res.json(result.rows);
        }
        catch(err:any) {
            res.status(500).json({error: err.message})
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

        } catch(err: any) {
            res.status(500).json({
                error: err.message
            });
        }
    }
} 

export default new CuratorsController();