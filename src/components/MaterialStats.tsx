'use client';

import { Material } from '@/types/material';

interface MaterialStatsProps {
  materials: Material[];
}

export function MaterialStats({ materials }: MaterialStatsProps) {
  const totalMaterials = materials.length;
  const totalValue = materials.reduce((sum, material) => sum + (material.quantity * material.price), 0);
  const lowStock = materials.filter(material => material.quantity <= material.minQuantity && material.quantity > 0).length;
  const outOfStock = materials.filter(material => material.quantity === 0).length;
  
  const categoryCounts = materials.reduce((acc, material) => {
    acc[material.category] = (acc[material.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="text-2xl">📦</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Materiales</p>
            <p className="text-2xl font-bold text-gray-900">{totalMaterials}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="text-2xl">💰</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Valor Total</p>
            <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
            <p className="text-2xl font-bold text-gray-900">{lowStock}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <span className="text-2xl">🚫</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Sin Stock</p>
            <p className="text-2xl font-bold text-gray-900">{outOfStock}</p>
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-3xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Categorías Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <span className="text-sm text-gray-500">{count} materiales</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}