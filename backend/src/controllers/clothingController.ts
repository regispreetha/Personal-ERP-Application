import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

const clothingItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  season: z.string().optional(),
  owner: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

export const getAllClothingItems = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const items = await prisma.clothingItem.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get clothing items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClothingItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const item = await prisma.clothingItem.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get clothing item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createClothingItem = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const data = clothingItemSchema.parse(req.body);

    const item = await prisma.clothingItem.create({
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
    console.error('Create clothing item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClothingItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const data = clothingItemSchema.partial().parse(req.body);

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.clothingItem.findFirst({
      where: { id, tenantId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await prisma.clothingItem.update({
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
    console.error('Update clothing item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClothingItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.clothingItem.findFirst({
      where: { id, tenantId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await prisma.clothingItem.delete({
      where: { id },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete clothing item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
