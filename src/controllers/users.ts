import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ensureAuth } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', ensureAuth, async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  res.json(users);
});

export default router;
