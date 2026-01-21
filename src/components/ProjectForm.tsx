import { Project } from '@/types/material';

interface ProjectFormProps {
  editingProject: Project | null;
  onSubmit: (data: { name: string; fileName?: string }) => void;
  onCancel: () => void;
}

export function ProjectForm({ editingProject, onSubmit, onCancel }: ProjectFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const fileName = formData.get('fileName') as string;
    
    onSubmit({ name, fileName: fileName || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={editingProject?.name || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Casa Residencial A"
              />
            </div>
            
            <div>
              <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Archivo Excel (opcional)
              </label>
              <input
                type="text"
                id="fileName"
                name="fileName"
                defaultValue={editingProject?.fileName || ''}
                className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: inventario_casa_a.xlsx"
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo se solicita si el proyecto no ha empezado
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              {editingProject ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
