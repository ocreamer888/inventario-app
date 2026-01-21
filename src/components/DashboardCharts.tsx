'use client';

import { Material } from '@/types/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface DashboardChartsProps {
  materials: Material[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function DashboardCharts({ materials }: DashboardChartsProps) {
  // Category distribution data
  const categoryData = Object.entries(
    materials.reduce((acc, material) => {
      acc[material.category] = (acc[material.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Value by category
  const valueByCategory = Object.entries(
    materials.reduce((acc, material) => {
      const value = material.quantity * material.price;
      acc[material.category] = (acc[material.category] || 0) + value;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, value]) => ({ category, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  // Stock status distribution
  const stockStatusData = [
    { name: 'Stock Normal', value: materials.filter(m => m.quantity > m.minQuantity).length },
    { name: 'Stock Bajo', value: materials.filter(m => m.quantity <= m.minQuantity && m.quantity > 0).length },
    { name: 'Sin Stock', value: materials.filter(m => m.quantity === 0).length }
  ];

  // Top 10 materials by value
  const topMaterialsByValue = materials
    .map(m => ({
      name: m.name.length > 20 ? m.name.substring(0, 20) + '...' : m.name,
      value: parseFloat((m.quantity * m.price).toFixed(2)),
      quantity: m.quantity
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Location distribution
  const locationData = Object.entries(
    materials.reduce((acc, material) => {
      acc[material.location] = (acc[material.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Price distribution analysis
  const priceRanges = [
    { range: '$0-50', min: 0, max: 50 },
    { range: '$51-100', min: 51, max: 100 },
    { range: '$101-200', min: 101, max: 200 },
    { range: '$201-500', min: 201, max: 500 },
    { range: '$500+', min: 501, max: Infinity }
  ];

  const priceDistribution = priceRanges.map(({ range, min, max }) => ({
    range,
    count: materials.filter(m => m.price >= min && m.price < max).length
  }));

  // Stock efficiency radar (comparing stock levels)
  const stockEfficiency = categoryData.map(({ name }) => {
    const categoryMaterials = materials.filter(m => m.category === name);
    const totalStock = categoryMaterials.reduce((sum, m) => sum + m.quantity, 0);
    const totalMinStock = categoryMaterials.reduce((sum, m) => sum + m.minQuantity, 0);
    const efficiency = totalMinStock > 0 ? (totalStock / totalMinStock) * 100 : 0;
    
    return {
      category: name.length > 15 ? name.substring(0, 15) + '...' : name,
      efficiency: parseFloat(Math.min(efficiency, 200).toFixed(1))
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Distribution - Pie Chart */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Value by Category - Bar Chart */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Valor Total por Categoría</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={valueByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Status - Pie Chart */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Inventario</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stockStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              <Cell fill="#10B981" />
              <Cell fill="#F59E0B" />
              <Cell fill="#EF4444" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Materials by Value */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Materiales por Valor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topMaterialsByValue} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value) => `$${value}`} />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Location Distribution */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Materiales por Ubicación</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Price Distribution */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Precios</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={priceDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Efficiency Radar */}
      {stockEfficiency.length > 0 && (
        <div className="bg-white rounded-3xl shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Eficiencia de Stock por Categoría
            <span className="text-sm font-normal text-gray-500 ml-2">
              (% de stock actual vs. stock mínimo)
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={stockEfficiency}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 200]} />
              <Radar name="Eficiencia %" dataKey="efficiency" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
