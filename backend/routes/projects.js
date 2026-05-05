import express from 'express';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/role.js';
import {
  createProject,
  getMyProjects,
  addMember,
  removeMember
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', auth, [
  body('name').notEmpty().withMessage('Project name is required')
], createProject);

router.get('/', auth, getMyProjects);
router.post('/:projectId/members', auth, isAdmin, addMember);
router.delete('/:projectId/members/:userId', auth, isAdmin, removeMember);

export default router;