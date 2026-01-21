import * as XLSX from 'xlsx';
import { Material } from '@/types/material';

// Type for imported materials (without database-specific fields)
export type ImportedMaterial = Omit<Material, 'id' | 'project_id' | 'user_id' | 'createdAt' | 'updatedAt'>;

export function exportToExcel(materials: Material[], fileName: string) {
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

  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

  const colWidths = [
    { wch: 10 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 },
    { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
    { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 30 },
    { wch: 15 }, { wch: 15 }
  ];
  ws['!cols'] = colWidths;

  const fullFileName = `${fileName}_Inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fullFileName);
  
  return fullFileName;
}

export function exportToCSV(materials: Material[], fileName: string) {
  const csvData = materials.map(material => [
    material.id, material.name, material.description, material.category,
    material.brand, material.color || '', material.size || '', material.dimensions || '',
    material.unit, material.quantity, material.minQuantity, material.price,
    material.quantity * material.price, material.location, material.supplier || '',
    material.notes || '', new Date(material.createdAt).toLocaleDateString('es-ES'),
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
  const fullFileName = `${fileName}_Inventario_${new Date().toISOString().split('T')[0]}.csv`;
  link.setAttribute('download', fullFileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return fullFileName;
}

export function exportToJSON(materials: Material[], fileName: string) {
  const dataStr = JSON.stringify(materials, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  const fullFileName = `${fileName}_Inventario_${new Date().toISOString().split('T')[0]}.json`;
  link.download = fullFileName;
  link.click();
  URL.revokeObjectURL(url);
  
  return fullFileName;
}

export async function importFromExcel(file: File): Promise<ImportedMaterial[]> {
  return new Promise((resolve, reject) => {
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

        const importedMaterials: ImportedMaterial[] = rows
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

        resolve(importedMaterials);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}

export async function importFromCSV(file: File): Promise<ImportedMaterial[]> {
  return new Promise((resolve, reject) => {
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

        const importedMaterials: ImportedMaterial[] = rows
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

        resolve(importedMaterials);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}

export async function importFromJSON(file: File): Promise<ImportedMaterial[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(data)) {
          throw new Error('El archivo JSON debe contener un array de materiales');
        }

        const importedMaterials: ImportedMaterial[] = data.map((item, index) => {
          if (!item.name || !item.category || !item.location) {
            throw new Error(`Material ${index + 1}: Faltan campos requeridos (name, category, location)`);
          }

          return {
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
            notes: item.notes || ''
          };
        });

        if (importedMaterials.length === 0) {
          throw new Error('No se encontraron materiales válidos para importar');
        }

        resolve(importedMaterials);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
