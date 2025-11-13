import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

const householdItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

export const getAllHouseholdItems = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const items = await prisma.householdItem.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get household items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHouseholdItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const item = await prisma.householdItem.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get household item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createHouseholdItem = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const data = householdItemSchema.parse(req.body);

    const item = await prisma.householdItem.create({
      data: {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        tenantId,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create household item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHouseholdItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const data = householdItemSchema.partial().parse(req.body);

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.householdItem.findFirst({
      where: { id, tenantId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await prisma.householdItem.update({
      where: { id },
      data: {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      },
    });

    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update household item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHouseholdItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.householdItem.findFirst({
      where: { id, tenantId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await prisma.householdItem.delete({
      where: { id },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete household item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
