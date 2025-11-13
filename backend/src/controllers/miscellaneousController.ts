import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

const miscellaneousItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  notes: z.string().optional(),
});

export const getAllMiscellaneousItems = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    const items = await prisma.miscellaneousItem.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(items);
  } catch (error) {
    console.error('Get miscellaneous items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMiscellaneousItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const item = await prisma.miscellaneousItem.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get miscellaneous item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createMiscellaneousItem = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;
    const data = miscellaneousItemSchema.parse(req.body);

    const item = await prisma.miscellaneousItem.create({
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
    console.error('Create miscellaneous item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMiscellaneousItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const data = miscellaneousItemSchema.partial().parse(req.body);

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.miscellaneousItem.findFirst({
      where: { id, tenantId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const item = await prisma.miscellaneousItem.update({
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
    console.error('Update miscellaneous item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMiscellaneousItem = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    // Check if item exists and belongs to tenant
    const existingItem = await prisma.miscellaneousItem.findFirst({
      where: { id, tenantId },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await prisma.miscellaneousItem.delete({
      where: { id },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete miscellaneous item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
