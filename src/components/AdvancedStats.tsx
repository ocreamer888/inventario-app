'use client';

import { useMemo } from 'react';
import { Material } from '@/types/material';
import { TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle, MapPin } from 'lucide-react';

interface AdvancedStatsProps {
  materials: Material[];
}

export function AdvancedStats({ materials }: AdvancedStatsProps) {
  // Memoize stats calculations to avoid hydration issues with Date.now()
  const stats = useMemo(() => {
    // Calculate various metrics
    const totalMaterials = materials.length;
    const totalValue = materials.reduce((sum, m) => sum + (m.quantity * m.price), 0);
    const totalQuantity = materials.reduce((sum, m) => sum + m.quantity, 0);
    const averagePrice = totalMaterials > 0 ? totalValue / totalQuantity : 0;
    
    // Stock health metrics
    const lowStock = materials.filter(m => m.quantity <= m.minQuantity && m.quantity > 0);
    const outOfStock = materials.filter(m => m.quantity === 0);
    const goodStock = materials.filter(m => m.quantity > m.minQuantity);
    const stockHealthPercentage = totalMaterials > 0 ? (goodStock.length / totalMaterials) * 100 : 0;

    // Category metrics
    const uniqueCategories = new Set(materials.map(m => m.category)).size;
    const uniqueLocations = new Set(materials.map(m => m.location)).size;
    const uniqueBrands = new Set(materials.map(m => m.brand)).size;

    // Most valuable material
    const mostValuableMaterial = materials.reduce((max, m) => {
      const value = m.quantity * m.price;
      const maxValue = max ? max.quantity * max.price : 0;
      return value > maxValue ? m : max;
    }, materials[0]);

    // Materials requiring attention (low stock + high value)
    const criticalMaterials = materials
      .filter(m => m.quantity <= m.minQuantity)
      .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
      .slice(0, 5);

    // Inventory turnover potential
    // Use a stable date to avoid hydration mismatch
    const today = new Date().setHours(0, 0, 0, 0);
    const slowMovingItems = materials.filter(m => {
      const daysOld = Math.floor((today - new Date(m.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysOld > 30 && m.quantity > m.minQuantity * 2;
    }).length;

    return {
      totalMaterials,
      totalValue,
      totalQuantity,
      averagePrice,
      lowStock,
      outOfStock,
      goodStock,
      stockHealthPercentage,
      uniqueCategories,
      uniqueLocations,
      uniqueBrands,
      mostValuableMaterial,
      criticalMaterials,
      slowMovingItems
    };
  }, [materials]);

  const {
    totalMaterials,
    totalValue,
    totalQuantity,
    averagePrice,
    stockHealthPercentage,
    uniqueCategories,
    uniqueLocations,
    uniqueBrands,
    mostValuableMaterial,
    criticalMaterials,
    slowMovingItems
  } = stats;

  const statsDisplay = [
    {
      title: 'Valor Promedio',
      value: `$${averagePrice.toFixed(2)}`,
      icon: DollarSign,
      color: 'blue',
      description: 'Por unidad de material'
    },
    {
      title: 'Salud del Inventario',
      value: `${stockHealthPercentage.toFixed(1)}%`,
      icon: stockHealthPercentage > 70 ? TrendingUp : TrendingDown,
      color: stockHealthPercentage > 70 ? 'green' : 'red',
      description: 'Materiales con stock adecuado'
    },
    {
      title: 'Categorías Activas',
      value: uniqueCategories,
      icon: Package,
      color: 'purple',
      description: `${uniqueBrands} marcas diferentes`
    },
    {
      title: 'Ubicaciones',
      value: uniqueLocations,
      icon: MapPin,
      color: 'indigo',
      description: 'Puntos de almacenamiento'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Alerts */}
      {criticalMaterials.length > 0 && (
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Materiales que Requieren Atención</h3>
          </div>
          <div className="space-y-3">
            {criticalMaterials.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-2xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{material.name}</p>
                  <p className="text-sm text-gray-600">
                    {material.category} - {material.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Stock: {material.quantity} / {material.minQuantity} min
                  </p>
                  <p className="text-sm text-gray-600">
                    Valor: ${(material.quantity * material.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500 rounded-3xl shadow-md p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Material Más Valioso</h4>
          {mostValuableMaterial ? (
            <>
              <p className="text-2xl font-bold mb-1">{mostValuableMaterial.name}</p>
              <p className="text-sm opacity-90">
                ${(mostValuableMaterial.quantity * mostValuableMaterial.price).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-lg">Sin datos</p>
          )}
        </div>

        <div className="bg-blue-500 rounded-3xl shadow-md p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Total en Inventario</h4>
          <p className="text-2xl font-bold mb-1">{totalQuantity.toLocaleString()}</p>
          <p className="text-sm opacity-90">Unidades totales</p>
        </div>

        <div className="bg-blue-500 rounded-3xl shadow-md p-6 text-white">
          <h4 className="text-sm font-medium opacity-90 mb-2">Rotación Lenta</h4>
          <p className="text-2xl font-bold mb-1">{slowMovingItems}</p>
          <p className="text-sm opacity-90">Materiales con exceso de stock</p>
        </div>
      </div>
    </div>
  );
}
