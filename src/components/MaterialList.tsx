'use client';

import { useState } from 'react';
import { Material } from '@/types/material';

interface MaterialListProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number, operation: 'add' | 'subtract') => void;
}

export function MaterialList({ materials, onEdit, onDelete, onUpdateQuantity }: MaterialListProps) {
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});

  const handleQuantityChange = (id: string, value: string) => {
    setQuantityInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleQuantityUpdate = (id: string, operation: 'add' | 'subtract') => {
    const inputValue = quantityInputs[id];
    if (inputValue && !isNaN(parseFloat(inputValue))) {
      const quantity = parseFloat(inputValue);
      onUpdateQuantity(id, quantity, operation);
      setQuantityInputs(prev => ({ ...prev, [id]: '' }));
    }
  };

  const getQuantityStatus = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity <= minQuantity) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getQuantityStatusText = (quantity: number, minQuantity: number) => {
    if (quantity === 0) return 'Sin stock';
    if (quantity <= minQuantity) return 'Stock bajo';
    return 'Stock disponible';
  };

  if (materials.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-md p-8 text-center">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">No hay materiales</h3>
        <p className="text-gray-500">Agrega tu primer material usando el formulario</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Materiales ({materials.length})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materials.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {material.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {material.brand && `${material.brand} • `}
                      {material.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {material.color && `${material.color} • `}
                      {material.size && `${material.size} • `}
                      {material.dimensions && `${material.dimensions} • `}
                      ${material.price.toFixed(2)}/{material.unit}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {material.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuantityStatus(material.quantity, material.minQuantity)}`}>
                        {material.quantity} {material.unit}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getQuantityStatusText(material.quantity, material.minQuantity)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Cantidad"
                        value={quantityInputs[material.id] || ''}
                        onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                        className="w-20 px-2 py-1 text-xs border text-gray-900 border-gray-300 rounded-full focus:ring-1 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={() => handleQuantityUpdate(material.id, 'add')}
                        className="px-4 py-2 text-xs bg-green-600 text-white rounded-full hover:bg-green-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleQuantityUpdate(material.id, 'subtract')}
                        className="px-4 py-2 text-xs bg-red-600 text-white rounded-full hover:bg-red-700"
                      >
                        -
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{material.location}</div>
                  {material.supplier && (
                    <div className="text-xs text-gray-900">Proveedor: {material.supplier}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(material)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(material.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}