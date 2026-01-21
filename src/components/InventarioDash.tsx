'use client';

import { useState } from 'react';
import { Material, Project } from '@/types/material';
import { useProjects } from '@/lib/hooks/useProjects';
import { useMaterials } from '@/lib/hooks/useMaterials';
import { ImportedMaterial } from '@/lib/utils/fileHandlers';
import { AppHeader } from './AppHeader';
import { ProjectSelector } from './ProjectSelector';
import { ImportExportPanel } from './ImportExportPanel';
import { MaterialFilters } from './MaterialFilters';
import { MaterialForm } from './MaterialForm';
import { MaterialList } from './MaterialList';
import { MaterialStats } from './MaterialStats';
import { EmptyProjectState } from './EmptyProjectState';
import { ProjectDashboard } from './ProjectDashboard';
import { MATERIAL_CATEGORIES } from '@/lib/constants/materials';
import { LayoutDashboard, Package } from 'lucide-react';

export default function InventarioDash() {
  const {
    projects,
    currentProject,
    createProject,
    updateProject,
    deleteProject,
    switchProject,
    loading: projectsLoading,
    error: projectsError
  } = useProjects();

  const {
    materials,
    filteredMaterials,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    editingMaterial,
    setEditingMaterial,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    updateQuantity,
    setMaterials,
    loading: materialsLoading,
    error: materialsError
  } = useMaterials({ currentProject, onProjectUpdate: updateProject });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'materials'>('dashboard');
  const [importStatus, setImportStatus] = useState<{ 
    type: 'success' | 'error' | null; 
    message: string 
  }>({ type: null, message: '' });

  const showStatus = (type: 'success' | 'error', message: string) => {
    setImportStatus({ type, message });
    setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
  };

  const handleCreateProject = async (data: { name: string; fileName?: string }) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        showStatus('success', 'Proyecto actualizado exitosamente');
      } else {
        await createProject(data);
        showStatus('success', `Proyecto "${data.name}" creado exitosamente`);
      }
      setShowProjectForm(false);
      setEditingProject(null);
    } catch (error) {
      showStatus('error', error instanceof Error ? error.message : 'Error al procesar proyecto');
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await updateProject(id, updates);
      showStatus('success', 'Proyecto actualizado exitosamente');
    } catch (error) {
      showStatus('error', error instanceof Error ? error.message : 'Error al actualizar proyecto');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      showStatus('success', 'Proyecto eliminado exitosamente');
    } catch (error) {
      showStatus('error', error instanceof Error ? error.message : 'Error al eliminar proyecto');
    }
  };

  const handleAddMaterial = async (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt' | 'project_id' | 'user_id'>) => {
    try {
      await addMaterial(material);
      showStatus('success', `Material "${material.name}" agregado al proyecto "${currentProject?.name}"`);
    } catch (error) {
      showStatus('error', error instanceof Error ? error.message : 'Error al agregar material');
    }
  };

  const handleUpdateMaterial = async (id: string, updates: Partial<Material>) => {
    try {
      await updateMaterial(id, updates);
      showStatus('success', 'Material actualizado exitosamente');
    } catch (error) {
      showStatus('error', error instanceof Error ? error.message : 'Error al actualizar material');
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este material?')) {
      try {
        await deleteMaterial(id);
        showStatus('success', 'Material eliminado exitosamente');
      } catch (error) {
        showStatus('error', error instanceof Error ? error.message : 'Error al eliminar material');
      }
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number, operation: 'add' | 'subtract') => {
    try {
      await updateQuantity(id, newQuantity, operation);
      showStatus('success', 'Cantidad actualizada exitosamente');
    } catch (error) {
      showStatus('error', error instanceof Error ? error.message : 'Error al actualizar cantidad');
    }
  };

  const handleImportMaterials = async (importedMaterials: ImportedMaterial[], shouldReplace: boolean) => {
    if (!currentProject) {
      showStatus('error', 'Debes seleccionar un proyecto primero');
      return;
    }

    try {
      // If replacing, delete all existing materials first
      if (shouldReplace && materials.length > 0) {
        for (const material of materials) {
          await deleteMaterial(material.id);
        }
      }

      // Import each material (they'll be added through the addMaterial function)
      let successCount = 0;
      let errorCount = 0;

      for (const material of importedMaterials) {
        try {
          // ImportedMaterial already has the correct type (no id, project_id, user_id, etc.)
          await addMaterial(material);
          successCount++;
        } catch (error) {
          console.error('Error importing material:', error);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        showStatus('success', `Se importaron ${successCount} materiales exitosamente`);
      } else {
        showStatus('error', `Se importaron ${successCount} materiales, pero ${errorCount} fallaron`);
      }
    } catch (error) {
      showStatus('error', error instanceof Error ? error.message : 'Error al importar materiales');
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Status and error messages */}
        {importStatus.type && (
          <div className={`mb-6 p-4 rounded-3xl ${
            importStatus.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {importStatus.message}
          </div>
        )}

        {/* Projects error */}
        {projectsError && (
          <div className="mb-6 p-4 rounded-3xl bg-red-100 text-red-800 border border-red-200">
            <strong>Error:</strong> {projectsError}
          </div>
        )}

        {/* Materials error */}
        {materialsError && (
          <div className="mb-6 p-4 rounded-3xl bg-yellow-100 text-yellow-800 border border-yellow-200">
            <strong>Error de materiales:</strong> {materialsError}
          </div>
        )}

        {/* Loading state */}
        {projectsLoading && (
          <div className="mb-6 p-4 rounded-3xl bg-blue-100 text-blue-800 border border-blue-200">
            Cargando proyectos...
          </div>
        )}

        <ProjectSelector
          projects={projects}
          currentProject={currentProject}
          showProjectForm={showProjectForm}
          editingProject={editingProject}
          onSelectProject={switchProject}
          onCreateProject={handleCreateProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onShowProjectForm={setShowProjectForm}
          onSetEditingProject={setEditingProject}
        />

        {currentProject ? (
          <>
            {/* View Mode Toggle */}
            <div className="mb-6 flex bg-white rounded-3xl shadow-md p-2 w-fit">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all ${
                  viewMode === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('materials')}
                className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all ${
                  viewMode === 'materials'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package className="w-5 h-5 mr-2" />
                Gestión de Materiales
              </button>
            </div>

            {viewMode === 'dashboard' ? (
              <ProjectDashboard project={currentProject} materials={materials} />
            ) : (
              <>
                <ImportExportPanel
                  currentProject={currentProject}
                  materials={materials}
                  onImportMaterials={handleImportMaterials}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Panel izquierdo - Formulario */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-md p-6 sticky top-8">
                      <MaterialForm
                        onSubmit={handleAddMaterial}
                        onUpdate={handleUpdateMaterial}
                        editingMaterial={editingMaterial}
                        onCancelEdit={() => setEditingMaterial(null)}
                        categories={MATERIAL_CATEGORIES as string[]}
                      />
                    </div>
                  </div>

                  {/* Panel derecho - Lista y estadísticas */}
                  <div className="lg:col-span-2 space-y-6">
                    <MaterialFilters
                      searchTerm={searchTerm}
                      selectedCategory={selectedCategory}
                      categories={MATERIAL_CATEGORIES as string[]}
                      onSearchChange={setSearchTerm}
                      onCategoryChange={setSelectedCategory}
                    />

                    <MaterialStats materials={filteredMaterials} />

                    <MaterialList
                      materials={filteredMaterials}
                      onEdit={setEditingMaterial}
                      onDelete={handleDeleteMaterial}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <EmptyProjectState onCreateProject={() => setShowProjectForm(true)} />
        )}
      </div>
    </div>
  );
}
