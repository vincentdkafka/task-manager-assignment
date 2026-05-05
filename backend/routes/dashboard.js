import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const projectIds = (await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true }
    })).map(p => p.projectId);

    const tasks = await prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      include: {
        assignee: { select: { id: true, name: true } }
      }
    });

    const now = new Date();
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const done = tasks.filter(t => t.status === 'DONE').length;
    const overdue = tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE'
    ).length;

    const perUser = {};
    tasks.forEach(t => {
      if (t.assignee) {
        perUser[t.assignee.name] = (perUser[t.assignee.name] || 0) + 1;
      }
    });

    res.json({ total, todo, inProgress, done, overdue, tasksPerUser: perUser });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error' });
  }
});

export default router;