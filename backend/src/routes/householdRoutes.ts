import express from 'express';
import {
  getAllHouseholdItems,
  getHouseholdItem,
  createHouseholdItem,
  updateHouseholdItem,
  deleteHouseholdItem,
} from '../controllers/householdController';
import { authMiddleware, tenantMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and tenant context
router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/', getAllHouseholdItems);
router.get('/:id', getHouseholdItem);
router.post('/', createHouseholdItem);
router.put('/:id', updateHouseholdItem);
router.delete('/:id', deleteHouseholdItem);

export default router;
