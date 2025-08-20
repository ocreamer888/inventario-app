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

export interface Project {
  id: string;
  name: string;
  fileName?: string;
  materials: Material[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  fileName?: string;
}
