import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './controllers/auth';
import booksRouter from './controllers/books';
import usersRouter from './controllers/users';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
