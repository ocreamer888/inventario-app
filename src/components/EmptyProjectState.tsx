interface EmptyProjectStateProps {
  onCreateProject: () => void;
}

export function EmptyProjectState({ onCreateProject }: EmptyProjectStateProps) {
  return (
    <div className="text-center py-16">
      <div className="bg-white rounded-3xl shadow-md p-8 max-w-md mx-auto">
        <div className="text-6xl mb-4">🏗️</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No hay proyecto seleccionado</h3>
        <p className="text-gray-600 mb-6">
          Crea un nuevo proyecto o selecciona uno existente para comenzar a gestionar el inventario de materiales.
        </p>
        <button
          onClick={onCreateProject}
          className="px-6 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Crear Primer Proyecto
        </button>
      </div>
    </div>
  );
}
