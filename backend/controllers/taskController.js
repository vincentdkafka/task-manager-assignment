import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { projectId } = req.params;
  const { title, description, dueDate, priority, assigneeId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: parseInt(projectId),
        creatorId: req.user.id,
        assigneeId: assigneeId || null
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } }
      }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Could not create task' });
  }
};

export const getProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  try {
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: parseInt(projectId)
        }
      }
    });

    if (!member) return res.status(403).json({ message: 'Not a project member' });

    const where = {
      projectId: parseInt(projectId),
      ...(member.role === 'MEMBER' && { assigneeId: req.user.id })
    };

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } }
      }
    });

    res.json({ tasks, role: member.role });
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch tasks' });
  }
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, priority, dueDate, assigneeId } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId: assigneeId || undefined
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } }
      }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Could not update task' });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await prisma.task.delete({ where: { id: parseInt(taskId) } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete task' });
  }
};