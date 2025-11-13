import express from 'express';
import {
  getOverallStats,
  getCategoryBreakdown,
  getLocationBreakdown,
  getConditionBreakdown,
  getPurchaseTrends,
  getClothingByOwner,
} from '../controllers/reportsController';
import { authMiddleware, tenantMiddleware } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and tenant context
router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/overall', getOverallStats);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/location-breakdown', getLocationBreakdown);
router.get('/condition-breakdown', getConditionBreakdown);
router.get('/purchase-trends', getPurchaseTrends);
router.get('/clothing-by-owner', getClothingByOwner);

export default router;
