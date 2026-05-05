import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, description } = req.body;
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        members: {
          create: { userId: req.user.id, role: 'ADMIN' }
        }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { members: { some: { userId: req.user.id } } },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addMember = async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const member = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: parseInt(projectId),
        role: role || 'MEMBER'
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: 'Could not add member' });
  }
};

export const removeMember = async (req, res) => {
  const { projectId, userId } = req.params;
  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: parseInt(userId),
          projectId: parseInt(projectId)
        }
      }
    });
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ message: 'Could not remove member' });
  }
};