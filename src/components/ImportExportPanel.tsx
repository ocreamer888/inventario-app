import { useRef, useState } from 'react';
import { Material, Project } from '@/types/material';
import { 
  exportToExcel, 
  exportToCSV, 
  exportToJSON,
  importFromExcel,
  importFromCSV,
  importFromJSON,
  ImportedMaterial
} from '@/lib/utils/fileHandlers';

interface ImportExportPanelProps {
  currentProject: Project | null;
  materials: Material[];
  onImportMaterials: (materials: ImportedMaterial[], shouldReplace: boolean) => void;
}

export function ImportExportPanel({ 
  currentProject, 
  materials, 
  onImportMaterials 
}: ImportExportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ 
    type: 'success' | 'error' | null; 
    message: string 
  }>({ type: null, message: '' });

  const showStatus = (type: 'success' | 'error', message: string) => {
    setImportStatus({ type, message });
    setTimeout(() => setImportStatus({ type: null, message: '' }), type === 'success' ? 5000 : 3000);
  };

  const handleExportExcel = () => {
    if (!currentProject) {
      showStatus('error', 'Debes seleccionar un proyecto para exportar');
      return;
    }
    try {
      const fileName = exportToExcel(materials, currentProject.name);
      showStatus('success', `Archivo Excel "${fileName}" descargado exitosamente`);
    } catch (error) {
      showStatus('error', 'Error al exportar Excel');
    }
  };

  const handleExportCSV = () => {
    if (!currentProject) {
      showStatus('error', 'Debes seleccionar un proyecto para exportar');
      return;
    }
    try {
      const fileName = exportToCSV(materials, currentProject.name);
      showStatus('success', `Archivo CSV "${fileName}" descargado exitosamente`);
    } catch (error) {
      showStatus('error', 'Error al exportar CSV');
    }
  };

  const handleExportJSON = () => {
    if (!currentProject) {
      showStatus('error', 'Debes seleccionar un proyecto para exportar');
      return;
    }
    try {
      const fileName = exportToJSON(materials, currentProject.name);
      showStatus('success', `Archivo JSON "${fileName}" descargado exitosamente`);
    } catch (error) {
      showStatus('error', 'Error al exportar JSON');
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!currentProject) {
      showStatus('error', 'Debes crear o seleccionar un proyecto primero');
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      let importedMaterials: ImportedMaterial[] = [];

      switch (fileExtension) {
        case 'xlsx':
        case 'xls':
          importedMaterials = await importFromExcel(file);
          break;
        case 'csv':
          importedMaterials = await importFromCSV(file);
          break;
        case 'json':
          importedMaterials = await importFromJSON(file);
          break;
        default:
          throw new Error('Formato de archivo no soportado. Use .xlsx, .csv o .json');
      }

      // Confirmar antes de reemplazar si hay materiales existentes
      if (materials.length > 0) {
        const shouldReplace = confirm(
          `¿Quieres reemplazar todos los materiales existentes (${materials.length}) con los ${importedMaterials.length} nuevos materiales?\n\n` +
          'Selecciona "Cancelar" para agregar los nuevos materiales sin eliminar los existentes.'
        );
        
        onImportMaterials(importedMaterials, shouldReplace);
        
        showStatus(
          'success', 
          shouldReplace 
            ? `Se importaron ${importedMaterials.length} materiales reemplazando los existentes`
            : `Se agregaron ${importedMaterials.length} nuevos materiales al inventario existente`
        );
      } else {
        onImportMaterials(importedMaterials, false);
        showStatus('success', `Se importaron ${importedMaterials.length} materiales exitosamente`);
      }

      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al importar:', error);
      showStatus(
        'error',
        `Error al importar: ${error instanceof Error ? error.message : 'Formato de archivo no válido'}`
      );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Importar y Exportar Inventario - Proyecto: {currentProject?.name || 'Ninguno'}
      </h3>
      
      {importStatus.type && (
        <div className={`mb-4 p-3 rounded-3xl ${
          importStatus.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {importStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel de Importación */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3"> Importar Datos</h4>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              onChange={handleFileImport}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-3xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500">
              Formatos soportados: Excel (.xlsx, .xls), CSV (.csv), JSON (.json)
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Campos requeridos:</strong> Nombre, Categoría, Ubicación</p>
              <p><strong>Campos opcionales:</strong> Descripción, Marca, Color, Tamaño, Medidas, Unidad, Cantidad, Precio, Proveedor, Notas</p>
            </div>
          </div>
        </div>

        {/* Panel de Exportación */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3"> Exportar Datos</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportExcel}
              disabled={materials.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📊 Excel
            </button>
            <button
              onClick={handleExportCSV}
              disabled={materials.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📄 CSV
            </button>
            <button
              onClick={handleExportJSON}
              disabled={materials.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-3xl hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔧 JSON
            </button>
          </div>
          {materials.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">No hay materiales para exportar</p>
          )}
        </div>
      </div>
    </div>
  );
}
