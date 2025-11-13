import express from 'express';
import {
  getAllMiscellaneousItems,
  getMiscellaneousItem,
  createMiscellaneousItem,
  updateMiscellaneousItem,
  deleteMiscellaneousItem,
} from '../controllers/miscellaneousController';
import { authMiddleware, tenantMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and tenant context
router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/', getAllMiscellaneousItems);
router.get('/:id', getMiscellaneousItem);
router.post('/', createMiscellaneousItem);
router.put('/:id', updateMiscellaneousItem);
router.delete('/:id', deleteMiscellaneousItem);

export default router;
