'use client';

import { useState } from 'react';
import { Material, Project } from '@/types/material';
import { BarChart3, TrendingUp, Package, Eye } from 'lucide-react';
import { AdvancedStats } from './AdvancedStats';
import { DashboardCharts } from './DashboardCharts';
import { MaterialStats } from './MaterialStats';

interface ProjectDashboardProps {
  project: Project;
  materials: Material[];
}

type ViewMode = 'overview' | 'analytics' | 'detailed';

export function ProjectDashboard({ project, materials }: ProjectDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const viewModes = [
    { id: 'overview' as ViewMode, label: 'Resumen', icon: Eye },
    { id: 'analytics' as ViewMode, label: 'Análisis Avanzado', icon: TrendingUp },
    { id: 'detailed' as ViewMode, label: 'Gráficos Detallados', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-3xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <p className="text-sm text-gray-600">
                Dashboard de Proyecto • {materials.length} materiales
              </p>
            </div>
          </div>
          
          {/* View Mode Selector */}
          <div className="flex bg-gray-100 rounded-2xl p-1">
            {viewModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    viewMode === mode.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          <MaterialStats materials={materials} />
          <AdvancedStats materials={materials} />
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <AdvancedStats materials={materials} />
        </div>
      )}

      {viewMode === 'detailed' && (
        <div className="space-y-6">
          <MaterialStats materials={materials} />
          <DashboardCharts materials={materials} />
        </div>
      )}
    </div>
  );
}
