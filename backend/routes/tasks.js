import express from 'express';
import { isAdmin } from '../middleware/role.js'
import { body } from 'express-validator';
import auth from '../middleware/auth.js';
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router({ mergeParams: true });

router.post('/', auth, [
  body('title').notEmpty().withMessage('Task title is required'),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH']).optional(),
  body('status').isIn(['TODO', 'IN_PROGRESS', 'DONE']).optional()
], createTask);

router.get('/', auth, getProjectTasks);
router.put('/:taskId', auth, updateTask);
router.delete('/:taskId', auth, isAdmin, deleteTask);

export default router;