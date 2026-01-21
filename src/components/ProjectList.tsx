import { Project } from '@/types/material';

interface ProjectListProps {
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectList({
  projects,
  currentProject,
  onSelectProject,
  onEditProject,
  onDeleteProject
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-4">No hay proyectos creados</p>
        <p className="text-sm">Crea tu primer proyecto para comenzar a gestionar el inventario</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <div
          key={project.id}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            currentProject?.id === project.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelectProject(project)}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{project.name}</h4>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProject(project);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
                aria-label="Editar proyecto"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('¿Estás seguro de que quieres eliminar este proyecto? Se perderán todos los materiales.')) {
                    onDeleteProject(project.id);
                  }
                }}
                className="text-red-600 hover:text-red-800 text-sm"
                aria-label="Eliminar proyecto"
              >
                🗑️
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {project.fileName ? `Archivo: ${project.fileName}` : 'Sin archivo inicial'}
          </p>
          <p className="text-sm text-gray-500">
            Creado: {new Date(project.createdAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      ))}
    </div>
  );
}
