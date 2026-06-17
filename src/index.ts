import express, {
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import petsRoutes from "./routes/pets.routes";
import curatorsRoutes from "./routes/curators.routes";
import petImagesRoutes from "./routes/petImages.routes";
import messengersRoutes from "./routes/messengers.routes";
import requestsRoutes from "./routes/requests.routes";

import pool from "./config/db";
import { initDb } from "./database/initDb";
import { validateTokenMiddleware } from "./middleware/middleware";
import { IUser } from "./types";

const app = express();

const allowedOrigins = ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Not allowed by CORS")
        );
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к базе данных', err.stack);
  } else {
    console.log('Подключено к базе данных:', res.rows);
  }
});

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
};

const users: IUser[] = [{
  id: "1",
  login: process.env.LOGIN as string,
  password: process.env.PASSWORD as string
}]

const secret = process.env.JWT_SECRET as string;

app.post("/login", (req: Request, res: Response) => {
  const { login, password } = req.body;

  const user = users.find((item) => item.login === login && item.password === password);

  if (!user) {
    res.sendStatus(401);
    return;
  }

  const accessToken = jwt.sign({ id: user.id, login: user.login }, secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign({ id: user.id, login: user.login }, secret, { expiresIn: "30d" });
  res.clearCookie("refreshToken");
  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      expires:
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  );
  res.json({ token: `Bearer ${accessToken}`, });
});


initDb();
app.use('/api/pets', petsRoutes);
app.use('/api/curators', curatorsRoutes);
app.use('/api/pet-images', petImagesRoutes);
app.use('/api/messengers', messengersRoutes);
app.use('/api/requests', requestsRoutes);
// app.use("/api/admin", validateTokenMiddleware, adminRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));