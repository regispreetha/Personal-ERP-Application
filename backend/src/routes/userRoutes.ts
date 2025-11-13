import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
} from '../controllers/userController';
import { authMiddleware, tenantMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication, tenant context, and admin role
router.use(authMiddleware);
router.use(tenantMiddleware);
router.use(adminMiddleware);

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.post('/:id/reset-password', resetPassword);
router.delete('/:id', deleteUser);

export default router;
