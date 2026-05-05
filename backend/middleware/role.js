import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const isAdmin = async (req, res, next) => {
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
    if (!member || member.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};