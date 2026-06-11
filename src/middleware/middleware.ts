import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";

const secret = process.env.JWT_SECRET as string;

interface TokenPayload {
    id: string;
    role: string;
}

export const validateTokenMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader?.split(" ")[1];

        if (!token) {
            res.sendStatus(401);
            return;
        }

        const decoded = jwt.verify(
            token,
            secret
        ) as TokenPayload;

        req.tokenData = decoded;

        next();
    } catch {
        res.sendStatus(403);
    }
};