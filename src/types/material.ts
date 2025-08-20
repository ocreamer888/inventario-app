export interface Material {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  color?: string;
  size?: string;
  dimensions?: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  price: number;
  location: string;
  supplier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  color: string;
  size: string;
  dimensions: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  price: number;
  location: string;
  supplier: string;
  notes: string;
}
