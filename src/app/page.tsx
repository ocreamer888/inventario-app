'use client';

import { useState, useEffect, useRef } from 'react';
import { MaterialForm } from '../components/MaterialForm';
import { MaterialList } from '../components/MaterialList';
import { MaterialStats } from '../components/MaterialStats';
import { Material } from '@/types/material';
import * as XLSX from 'xlsx';

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedMaterials = localStorage.getItem('inventario-materials');
    if (savedMaterials) {
      try {
        const parsedMaterials = JSON.parse(savedMaterials);
        setMaterials(parsedMaterials);
      } catch (error) {
        console.error('Error al cargar datos del localStorage:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cada vez que cambien
  useEffect(() => {
    if (materials.length > 0) {
      localStorage.setItem('inventario-materials', JSON.stringify(materials));
    }
  }, [materials]);

  // Filtrar materiales
  useEffect(() => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedCategory]);

  const addMaterial = (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMaterial: Material = {
      ...material,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMaterials(prev => [...prev, newMaterial]);
    
    // Mostrar mensaje de éxito
    setImportStatus({ 
      type: 'success', 
      message: `Material "${material.name}" agregado exitosamente. Recuerda exportar tus datos para guardarlos.` 
    });
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
  };

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(material =>
      material.id === id
        ? { ...material, ...updates, updatedAt: new Date().toISOString() }
        : material
    ));
    setEditingMaterial(null);
    
    // Mostrar mensaje de éxito
    setImportStatus({ 
      type: 'success', 
      message: `Material actualizado exitosamente. Recuerda exportar tus datos para guardarlos.` 
    });
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
  };

  const deleteMaterial = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este material?')) {
      setMaterials(prev => prev.filter(material => material.id !== id));
      
      // Mostrar mensaje de éxito
      setImportStatus({ 
        type: 'success', 
        message: `Material eliminado exitosamente. Recuerda exportar tus datos para guardarlos.` 
      });
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
    }
  };

  const updateQuantity = (id: string, newQuantity: number, operation: 'add' | 'subtract') => {
    setMaterials(prev => prev.map(material => {
      if (material.id === id) {
        const currentQuantity = material.quantity;
        let newQuantityValue = currentQuantity;
        
        if (operation === 'add') {
          newQuantityValue = currentQuantity + newQuantity;
        } else if (operation === 'subtract') {
          newQuantityValue = Math.max(0, currentQuantity - newQuantity);
        }
        
        return {
          ...material,
          quantity: newQuantityValue,
          updatedAt: new Date().toISOString()
        };
      }
      return material;
    }));
    
    // Mostrar mensaje de éxito
    setImportStatus({ 
      type: 'success', 
      message: `Cantidad actualizada. Recuerda exportar tus datos para guardarlos.` 
    });
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
  };

  const exportToExcel = () => {
    // Preparar datos para Excel
    const excelData = materials.map(material => ({
      'ID': material.id,
      'Nombre': material.name,
      'Descripción': material.description,
      'Categoría': material.category,
      'Marca': material.brand,
      'Color': material.color || '',
      'Tamaño': material.size || '',
      'Medidas': material.dimensions || '',
      'Unidad': material.unit,
      'Cantidad Actual': material.quantity,
      'Cantidad Mínima': material.minQuantity,
      'Precio por Unidad': material.price,
      'Valor Total': material.quantity * material.price,
      'Ubicación': material.location,
      'Proveedor': material.supplier || '',
      'Notas': material.notes || '',
      'Fecha Creación': new Date(material.createdAt).toLocaleDateString('es-ES'),
      'Última Actualización': new Date(material.updatedAt).toLocaleDateString('es-ES')
    }));

    // Crear workbook y worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 10 }, // ID
      { wch: 25 }, // Nombre
      { wch: 30 }, // Descripción
      { wch: 15 }, // Categoría
      { wch: 15 }, // Marca
      { wch: 10 }, // Color
      { wch: 10 }, // Tamaño
      { wch: 15 }, // Medidas
      { wch: 10 }, // Unidad
      { wch: 15 }, // Cantidad Actual
      { wch: 15 }, // Cantidad Mínima
      { wch: 15 }, // Precio por Unidad
      { wch: 15 }, // Valor Total
      { wch: 20 }, // Ubicación
      { wch: 20 }, // Proveedor
      { wch: 30 }, // Notas
      { wch: 15 }, // Fecha Creación
      { wch: 15 }  // Última Actualización
    ];
    ws['!cols'] = colWidths;

    // Descargar archivo
    const fileName = `Inventario_Construccion_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    // Mostrar mensaje de éxito
    setImportStatus({ 
      type: 'success', 
      message: `Archivo Excel "${fileName}" descargado exitosamente` 
    });
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
  };

  const exportToCSV = () => {
    const csvData = materials.map(material => [
      material.id,
      material.name,
      material.description,
      material.category,
      material.brand,
      material.color || '',
      material.size || '',
      material.dimensions || '',
      material.unit,
      material.quantity,
      material.minQuantity,
      material.price,
      material.quantity * material.price,
      material.location,
      material.supplier || '',
      material.notes || '',
      new Date(material.createdAt).toLocaleDateString('es-ES'),
      new Date(material.updatedAt).toLocaleDateString('es-ES')
    ]);

    const headers = [
      'ID', 'Nombre', 'Descripción', 'Categoría', 'Marca', 'Color', 'Tamaño',
      'Medidas', 'Unidad', 'Cantidad Actual', 'Cantidad Mínima', 'Precio por Unidad',
      'Valor Total', 'Ubicación', 'Proveedor', 'Notas', 'Fecha Creación', 'Última Actualización'
    ];

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Inventario_Construccion_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Mostrar mensaje de éxito
    setImportStatus({ 
      type: 'success', 
      message: `Archivo CSV descargado exitosamente` 
    });
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(materials, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inventario_Construccion_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    // Mostrar mensaje de éxito
    setImportStatus({ 
      type: 'success', 
      message: `Archivo JSON descargado exitosamente` 
    });
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
  };

  const importFromExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          throw new Error('El archivo debe tener al menos una fila de encabezados y una fila de datos');
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as (string | number | null | undefined)[][];

        const importedMaterials: Material[] = rows
          .filter(row => row.length > 0 && row.some(cell => cell !== null && cell !== undefined))
          .map((row, index) => {
            const material: Partial<Material> = {};
            
            headers.forEach((header, colIndex) => {
              const value = row[colIndex];
              if (value !== null && value !== undefined) {
                switch (header.toLowerCase()) {
                  case 'nombre':
                    material.name = String(value);
                    break;
                  case 'descripción':
                    material.description = String(value);
                    break;
                  case 'categoría':
                    material.category = String(value);
                    break;
                  case 'marca':
                    material.brand = String(value);
                    break;
                  case 'color':
                    material.color = String(value);
                    break;
                  case 'tamaño':
                    material.size = String(value);
                    break;
                  case 'medidas':
                    material.dimensions = String(value);
                    break;
                  case 'unidad':
                    material.unit = String(value);
                    break;
                  case 'cantidad actual':
                    material.quantity = parseFloat(String(value)) || 0;
                    break;
                  case 'cantidad mínima':
                    material.minQuantity = parseFloat(String(value)) || 0;
                    break;
                  case 'precio por unidad':
                    material.price = parseFloat(String(value)) || 0;
                    break;
                  case 'ubicación':
                    material.location = String(value);
                    break;
                  case 'proveedor':
                    material.supplier = String(value);
                    break;
                  case 'notas':
                    material.notes = String(value);
                    break;
                }
              }
            });

            // Validar campos requeridos
            if (!material.name || !material.category || !material.location) {
              throw new Error(`Fila ${index + 2}: Faltan campos requeridos (Nombre, Categoría, Ubicación)`);
            }

            // Valores por defecto
            return {
              id: Date.now().toString() + index,
              name: material.name!,
              description: material.description || '',
              category: material.category!,
              brand: material.brand || '',
              color: material.color || '',
              size: material.size || '',
              dimensions: material.dimensions || '',
              unit: material.unit || 'unidades',
              quantity: material.quantity || 0,
              minQuantity: material.minQuantity || 0,
              price: material.price || 0,
              location: material.location!,
              supplier: material.supplier || '',
              notes: material.notes || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });

        if (importedMaterials.length === 0) {
          throw new Error('No se encontraron datos válidos para importar');
        }

        // Confirmar antes de reemplazar
        if (materials.length > 0) {
          const shouldReplace = confirm(
            `¿Quieres reemplazar todos los materiales existentes (${materials.length}) con los ${importedMaterials.length} nuevos materiales?\n\n` +
            'Selecciona "Cancelar" para agregar los nuevos materiales sin eliminar los existentes.'
          );
          
          if (shouldReplace) {
            setMaterials(importedMaterials);
            setImportStatus({ type: 'success', message: `Se importaron ${importedMaterials.length} materiales reemplazando los existentes` });
          } else {
            setMaterials(prev => [...prev, ...importedMaterials]);
            setImportStatus({ type: 'success', message: `Se agregaron ${importedMaterials.length} nuevos materiales al inventario existente` });
          }
        } else {
          setMaterials(importedMaterials);
          setImportStatus({ type: 'success', message: `Se importaron ${importedMaterials.length} materiales exitosamente` });
        }

        // Limpiar el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error) {
        console.error('Error al importar:', error);
        setImportStatus({ 
          type: 'error', 
          message: `Error al importar: ${error instanceof Error ? error.message : 'Formato de archivo no válido'}` 
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const importFromCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n');
        
        if (lines.length < 2) {
          throw new Error('El archivo debe tener al menos una fila de encabezados y una fila de datos');
        }

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const rows = lines.slice(1).filter(line => line.trim().length > 0);

        const importedMaterials: Material[] = rows
          .filter(row => row.length > 0)
          .map((row, index) => {
            const values = row.split(',').map(v => v.replace(/"/g, '').trim());
            const material: Partial<Material> = {};
            
            headers.forEach((header, colIndex) => {
              const value = values[colIndex];
              if (value && value !== '') {
                switch (header.toLowerCase()) {
                  case 'nombre':
                    material.name = value;
                    break;
                  case 'descripción':
                    material.description = value;
                    break;
                  case 'categoría':
                    material.category = value;
                    break;
                  case 'marca':
                    material.brand = value;
                    break;
                  case 'color':
                    material.color = value;
                    break;
                  case 'tamaño':
                    material.size = value;
                    break;
                  case 'medidas':
                    material.dimensions = value;
                    break;
                  case 'unidad':
                    material.unit = value;
                    break;
                  case 'cantidad actual':
                    material.quantity = parseFloat(String(value)) || 0;
                    break;
                  case 'cantidad mínima':
                    material.minQuantity = parseFloat(String(value)) || 0;
                    break;
                  case 'precio por unidad':
                    material.price = parseFloat(String(value)) || 0;
                    break;
                  case 'ubicación':
                    material.location = value;
                    break;
                  case 'proveedor':
                    material.supplier = value;
                    break;
                  case 'notas':
                    material.notes = value;
                    break;
                }
              }
            });

            // Validar campos requeridos
            if (!material.name || !material.category || !material.location) {
              throw new Error(`Fila ${index + 2}: Faltan campos requeridos (Nombre, Categoría, Ubicación)`);
            }

            return {
              id: Date.now().toString() + index,
              name: material.name!,
              description: material.description || '',
              category: material.category!,
              brand: material.brand || '',
              color: material.color || '',
              size: material.size || '',
              dimensions: material.dimensions || '',
              unit: material.unit || 'unidades',
              quantity: material.quantity || 0,
              minQuantity: material.minQuantity || 0,
              price: material.price || 0,
              location: material.location!,
              supplier: material.supplier || '',
              notes: material.notes || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });

        if (importedMaterials.length === 0) {
          throw new Error('No se encontraron datos válidos para importar');
        }

        // Confirmar antes de reemplazar
        if (materials.length > 0) {
          const shouldReplace = confirm(
            `¿Quieres reemplazar todos los materiales existentes (${materials.length}) con los ${importedMaterials.length} nuevos materiales?\n\n` +
            'Selecciona "Cancelar" para agregar los nuevos materiales sin eliminar los existentes.'
          );
          
          if (shouldReplace) {
            setMaterials(importedMaterials);
            setImportStatus({ type: 'success', message: `Se importaron ${importedMaterials.length} materiales reemplazando los existentes` });
          } else {
            setMaterials(prev => [...prev, ...importedMaterials]);
            setImportStatus({ type: 'success', message: `Se agregaron ${importedMaterials.length} nuevos materiales al inventario existente` });
          }
        } else {
          setMaterials(importedMaterials);
          setImportStatus({ type: 'success', message: `Se importaron ${importedMaterials.length} materiales exitosamente` });
        }

        // Limpiar el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error) {
        console.error('Error al importar CSV:', error);
        setImportStatus({ 
          type: 'error', 
          message: `Error al importar CSV: ${error instanceof Error ? error.message : 'Formato de archivo no válido'}` 
        });
      }
    };
    reader.readAsText(file);
  };

  const importFromJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(data)) {
          throw new Error('El archivo JSON debe contener un array de materiales');
        }

        const importedMaterials: Material[] = data.map((item, index) => {
          // Validar estructura básica
          if (!item.name || !item.category || !item.location) {
            throw new Error(`Material ${index + 1}: Faltan campos requeridos (name, category, location)`);
          }

          return {
            id: Date.now().toString() + index,
            name: item.name,
            description: item.description || '',
            category: item.category,
            brand: item.brand || '',
            color: item.color || '',
            size: item.size || '',
            dimensions: item.dimensions || '',
            unit: item.unit || 'unidades',
            quantity: parseFloat(String(item.quantity)) || 0,
            minQuantity: parseFloat(String(item.minQuantity)) || 0,
            price: parseFloat(String(item.price)) || 0,
            location: item.location,
            supplier: item.supplier || '',
            notes: item.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        });

        if (importedMaterials.length === 0) {
          throw new Error('No se encontraron materiales válidos para importar');
        }

        // Confirmar antes de reemplazar
        if (materials.length > 0) {
          const shouldReplace = confirm(
            `¿Quieres reemplazar todos los materiales existentes (${materials.length}) con los ${importedMaterials.length} nuevos materiales?\n\n` +
            'Selecciona "Cancelar" para agregar los nuevos materiales sin eliminar los existentes.'
          );
          
          if (shouldReplace) {
            setMaterials(importedMaterials);
            setImportStatus({ type: 'success', message: `Se importaron ${importedMaterials.length} materiales reemplazando los existentes` });
          } else {
            setMaterials(prev => [...prev, ...importedMaterials]);
            setImportStatus({ type: 'success', message: `Se agregaron ${importedMaterials.length} nuevos materiales al inventario existente` });
          }
        } else {
          setMaterials(importedMaterials);
          setImportStatus({ type: 'success', message: `Se importaron ${importedMaterials.length} materiales exitosamente` });
        }

        // Limpiar el input de archivo
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error) {
        console.error('Error al importar JSON:', error);
        setImportStatus({ 
          type: 'error', 
          message: `Error al importar JSON: ${error instanceof Error ? error.message : 'Formato de archivo no válido'}` 
        });
      }
    };
    reader.readAsText(file);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      switch (fileExtension) {
        case 'xlsx':
        case 'xls':
          importFromExcel(file);
          break;
        case 'csv':
          importFromCSV(file);
          break;
        case 'json':
          importFromJSON(file);
          break;
        default:
          throw new Error('Formato de archivo no soportado. Use .xlsx, .csv o .json');
      }
    } catch (error) {
      setImportStatus({ 
        type: 'error', 
        message: `Error: ${error instanceof Error ? error.message : 'Formato no válido'}` 
      });
    }
  };

  const categories = [
    'Cemento y Mortero',
    'Ladrillos y Bloques',
    'Acero y Metal',
    'Madera',
    'Pinturas y Barnices',
    'Plomería',
    'Eléctrico',
    'Herramientas',
    'Otros'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🏗️ Inventario de Materiales - RMT Soluciones</h1>
          <p className="text-blue-100 mt-2">Gestión completa de materiales y suministros</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Panel de importación/exportación */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Importar y Exportar Inventario</h3>
          
          {/* Mensajes de estado */}
          {importStatus.type && (
            <div className={`mb-4 p-3 rounded-lg ${
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                  onClick={exportToExcel}
                  disabled={materials.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📊 Excel
                </button>
                <button
                  onClick={exportToCSV}
                  disabled={materials.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📄 CSV
                </button>
                <button
                  onClick={exportToJSON}
                  disabled={materials.length === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel izquierdo - Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <MaterialForm
                onSubmit={addMaterial}
                onUpdate={updateMaterial}
                editingMaterial={editingMaterial}
                onCancelEdit={() => setEditingMaterial(null)}
                categories={categories}
              />
            </div>
          </div>

          {/* Panel derecho - Lista y estadísticas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar materiales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estadísticas */}
            <MaterialStats materials={filteredMaterials} />

            {/* Lista de materiales */}
            <MaterialList
              materials={filteredMaterials}
              onEdit={setEditingMaterial}
              onDelete={deleteMaterial}
              onUpdateQuantity={updateQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
