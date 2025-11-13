import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get overall statistics
export const getOverallStats = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const [householdCount, clothingCount, miscCount] = await Promise.all([
      prisma.householdItem.count({ where: { tenantId } }),
      prisma.clothingItem.count({ where: { tenantId } }),
      prisma.miscellaneousItem.count({ where: { tenantId } }),
    ]);

    const [householdValue, clothingValue, miscValue] = await Promise.all([
      prisma.householdItem.aggregate({
        where: { tenantId, purchasePrice: { not: null } },
        _sum: { purchasePrice: true },
      }),
      prisma.clothingItem.aggregate({
        where: { tenantId, purchasePrice: { not: null } },
        _sum: { purchasePrice: true },
      }),
      prisma.miscellaneousItem.aggregate({
        where: { tenantId, purchasePrice: { not: null } },
        _sum: { purchasePrice: true },
      }),
    ]);

    res.json({
      totalItems: householdCount + clothingCount + miscCount,
      totalValue:
        (householdValue._sum.purchasePrice || 0) +
        (clothingValue._sum.purchasePrice || 0) +
        (miscValue._sum.purchasePrice || 0),
      byModule: {
        household: { count: householdCount, value: householdValue._sum.purchasePrice || 0 },
        clothing: { count: clothingCount, value: clothingValue._sum.purchasePrice || 0 },
        miscellaneous: { count: miscCount, value: miscValue._sum.purchasePrice || 0 },
      },
    });
  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get category breakdown
export const getCategoryBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const [householdItems, clothingItems, miscItems] = await Promise.all([
      prisma.householdItem.findMany({
        where: { tenantId },
        select: { category: true, quantity: true, purchasePrice: true },
      }),
      prisma.clothingItem.findMany({
        where: { tenantId },
        select: { category: true, purchasePrice: true },
      }),
      prisma.miscellaneousItem.findMany({
        where: { tenantId },
        select: { category: true, quantity: true, purchasePrice: true },
      }),
    ]);

    // Aggregate by category
    const categoryMap = new Map<string, { count: number; value: number; module: string }>();

    householdItems.forEach((item) => {
      const key = `Household: ${item.category}`;
      const existing = categoryMap.get(key) || { count: 0, value: 0, module: 'household' };
      categoryMap.set(key, {
        count: existing.count + item.quantity,
        value: existing.value + (item.purchasePrice || 0),
        module: 'household',
      });
    });

    clothingItems.forEach((item) => {
      const key = `Clothing: ${item.category}`;
      const existing = categoryMap.get(key) || { count: 0, value: 0, module: 'clothing' };
      categoryMap.set(key, {
        count: existing.count + 1,
        value: existing.value + (item.purchasePrice || 0),
        module: 'clothing',
      });
    });

    miscItems.forEach((item) => {
      const key = `Misc: ${item.category}`;
      const existing = categoryMap.get(key) || { count: 0, value: 0, module: 'miscellaneous' };
      categoryMap.set(key, {
        count: existing.count + item.quantity,
        value: existing.value + (item.purchasePrice || 0),
        module: 'miscellaneous',
      });
    });

    const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));

    res.json(categories);
  } catch (error) {
    console.error('Get category breakdown error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get location breakdown
export const getLocationBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const [householdItems, clothingItems, miscItems] = await Promise.all([
      prisma.householdItem.findMany({
        where: { tenantId, location: { not: null } },
        select: { location: true, quantity: true },
      }),
      prisma.clothingItem.findMany({
        where: { tenantId, location: { not: null } },
        select: { location: true },
      }),
      prisma.miscellaneousItem.findMany({
        where: { tenantId, location: { not: null } },
        select: { location: true, quantity: true },
      }),
    ]);

    const locationMap = new Map<string, number>();

    householdItems.forEach((item) => {
      if (item.location) {
        locationMap.set(item.location, (locationMap.get(item.location) || 0) + item.quantity);
      }
    });

    clothingItems.forEach((item) => {
      if (item.location) {
        locationMap.set(item.location, (locationMap.get(item.location) || 0) + 1);
      }
    });

    miscItems.forEach((item) => {
      if (item.location) {
        locationMap.set(item.location, (locationMap.get(item.location) || 0) + item.quantity);
      }
    });

    const locations = Array.from(locationMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json(locations);
  } catch (error) {
    console.error('Get location breakdown error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get condition breakdown
export const getConditionBreakdown = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const [householdItems, clothingItems] = await Promise.all([
      prisma.householdItem.findMany({
        where: { tenantId, condition: { not: null } },
        select: { condition: true, quantity: true },
      }),
      prisma.clothingItem.findMany({
        where: { tenantId, condition: { not: null } },
        select: { condition: true },
      }),
    ]);

    const conditionMap = new Map<string, number>();

    householdItems.forEach((item) => {
      if (item.condition) {
        conditionMap.set(item.condition, (conditionMap.get(item.condition) || 0) + item.quantity);
      }
    });

    clothingItems.forEach((item) => {
      if (item.condition) {
        conditionMap.set(item.condition, (conditionMap.get(item.condition) || 0) + 1);
      }
    });

    const conditions = Array.from(conditionMap.entries()).map(([name, count]) => ({ name, count }));

    res.json(conditions);
  } catch (error) {
    console.error('Get condition breakdown error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get purchase trends over time
export const getPurchaseTrends = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const [householdItems, clothingItems, miscItems] = await Promise.all([
      prisma.householdItem.findMany({
        where: { tenantId, purchaseDate: { not: null } },
        select: { purchaseDate: true, purchasePrice: true },
      }),
      prisma.clothingItem.findMany({
        where: { tenantId, purchaseDate: { not: null } },
        select: { purchaseDate: true, purchasePrice: true },
      }),
      prisma.miscellaneousItem.findMany({
        where: { tenantId, purchaseDate: { not: null } },
        select: { purchaseDate: true, purchasePrice: true },
      }),
    ]);

    // Group by month
    const monthMap = new Map<string, { count: number; value: number }>();

    const processItems = (items: any[]) => {
      items.forEach((item) => {
        if (item.purchaseDate) {
          const date = new Date(item.purchaseDate);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const existing = monthMap.get(monthKey) || { count: 0, value: 0 };
          monthMap.set(monthKey, {
            count: existing.count + 1,
            value: existing.value + (item.purchasePrice || 0),
          });
        }
      });
    };

    processItems(householdItems);
    processItems(clothingItems);
    processItems(miscItems);

    const trends = Array.from(monthMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(trends);
  } catch (error) {
    console.error('Get purchase trends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get clothing by owner
export const getClothingByOwner = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const clothingItems = await prisma.clothingItem.findMany({
      where: { tenantId, owner: { not: null } },
      select: { owner: true, purchasePrice: true },
    });

    const ownerMap = new Map<string, { count: number; value: number }>();

    clothingItems.forEach((item) => {
      if (item.owner) {
        const existing = ownerMap.get(item.owner) || { count: 0, value: 0 };
        ownerMap.set(item.owner, {
          count: existing.count + 1,
          value: existing.value + (item.purchasePrice || 0),
        });
      }
    });

    const owners = Array.from(ownerMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);

    res.json(owners);
  } catch (error) {
    console.error('Get clothing by owner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
