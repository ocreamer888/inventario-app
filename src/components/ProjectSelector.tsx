import { Project } from '@/types/material';
import { ProjectList } from './ProjectList';
import { ProjectForm } from './ProjectForm';

interface ProjectSelectorProps {
  projects: Project[];
  currentProject: Project | null;
  showProjectForm: boolean;
  editingProject: Project | null;
  onSelectProject: (project: Project) => void;
  onCreateProject: (data: { name: string; fileName?: string }) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
  onShowProjectForm: (show: boolean) => void;
  onSetEditingProject: (project: Project | null) => void;
}

export function ProjectSelector({
  projects,
  currentProject,
  showProjectForm,
  editingProject,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onShowProjectForm,
  onSetEditingProject
}: ProjectSelectorProps) {

  const handleSubmitProject = (data: { name: string; fileName?: string }) => {
    if (editingProject) {
      onUpdateProject(editingProject.id, data);
    } else {
      onCreateProject(data);
    }
    onShowProjectForm(false);
    onSetEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    onSetEditingProject(project);
    onShowProjectForm(true);
  };

  const handleCancel = () => {
    onShowProjectForm(false);
    onSetEditingProject(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <h3 className="text-lg font-medium text-gray-900">Gestión de Proyectos</h3>
        <button
          onClick={() => onShowProjectForm(true)}
          className="px-4 py-2 bg-blue-700 text-white rounded-3xl hover:bg-blue-700 transition-colors"
        >
          + Nuevo Proyecto
        </button>
      </div>

      <ProjectList
        projects={projects}
        currentProject={currentProject}
        onSelectProject={onSelectProject}
        onEditProject={handleEditProject}
        onDeleteProject={onDeleteProject}
      />

      {showProjectForm && (
        <ProjectForm
          editingProject={editingProject}
          onSubmit={handleSubmitProject}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
