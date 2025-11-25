import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ensureAuth } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
});

router.post('/', ensureAuth, async (req, res) => {
  const { title, author, isbn, copies } = req.body;
  const b = await prisma.book.create({ data: { title, author, isbn, copies: copies || 1 } });
  res.json(b);
});

router.post('/checkout', ensureAuth, async (req:any, res) => {
  const { bookId, userId } = req.body;
  // simplified: decrement copies and create transaction
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || book.copies < 1) return res.status(400).json({ error: 'not available' });
  await prisma.book.update({ where: { id: bookId }, data: { copies: book.copies - 1 } });
  const tx = await prisma.transaction.create({ data: { type: 'CHECKOUT', bookId, userId, date: new Date() } });
  res.json(tx);
});

router.post('/checkin', ensureAuth, async (req:any, res) => {
  const { bookId, userId } = req.body;
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) return res.status(400).json({ error: 'book missing' });
  await prisma.book.update({ where: { id: bookId }, data: { copies: book.copies + 1 } });
  const tx = await prisma.transaction.create({ data: { type: 'CHECKIN', bookId, userId, date: new Date() } });
  res.json(tx);
});

export default router;
