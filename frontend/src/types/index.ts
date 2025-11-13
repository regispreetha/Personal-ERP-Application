export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  tenant: Tenant;
}

export interface HouseholdItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  condition?: string;
  notes?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  size?: string;
  color?: string;
  brand?: string;
  season?: string;
  owner?: string;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  condition?: string;
  notes?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MiscellaneousItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
