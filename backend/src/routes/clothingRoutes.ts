import express from 'express';
import {
  getAllClothingItems,
  getClothingItem,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
} from '../controllers/clothingController';
import { authMiddleware, tenantMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and tenant context
router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/', getAllClothingItems);
router.get('/:id', getClothingItem);
router.post('/', createClothingItem);
router.put('/:id', updateClothingItem);
router.delete('/:id', deleteClothingItem);

export default router;
