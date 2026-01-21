# 🏗️ Inventario de Construcción

Una aplicación web moderna y completa para la gestión de inventario de materiales de construcción, construida con Next.js 16, React 19 y TypeScript.

## ✨ Características Principales

- **Dashboard de Analytics con Gráficos**: Visualización completa con 8+ tipos de gráficos interactivos (NUEVO ⭐)
- **Análisis Inteligente**: KPIs, métricas avanzadas y alertas automáticas de materiales críticos
- **Gestión Multi-Proyecto**: Maneja múltiples proyectos de construcción independientes
- **Gestión Completa de Materiales**: Agregar, editar, eliminar y rastrear materiales de construcción
- **Categorización Inteligente**: Organización por categorías predefinidas (cemento, acero, madera, etc.)
- **Control de Stock**: Monitoreo de cantidades actuales y mínimas con alertas
- **Búsqueda y Filtrado**: Búsqueda por nombre, descripción, marca y filtrado por categoría
- **Importación/Exportación**: Soporte para Excel (.xlsx), CSV y JSON
- **Persistencia Local**: Almacenamiento en localStorage del navegador
- **Interfaz Responsiva**: Diseño moderno y adaptable a todos los dispositivos

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS 4
- **Visualización de Datos**: Recharts (gráficos interactivos)
- **Iconos**: Lucide React
- **Gestión de Datos**: XLSX para importación/exportación de Excel
- **Estado**: React Hooks (useState, useEffect, useCallback)
- **Autenticación**: Supabase Auth

## 📋 Funcionalidades Detalladas

### 📊 Dashboard de Analytics (NUEVO)
- **Tres Vistas Interactivas**:
  - **Resumen**: Vista general con estadísticas y alertas
  - **Análisis Avanzado**: KPIs y métricas detalladas
  - **Gráficos Detallados**: 8+ visualizaciones interactivas

- **Gráficos Disponibles**:
  - Distribución por Categoría (Pie Chart)
  - Valor Total por Categoría (Bar Chart)
  - Estado de Inventario (Pie Chart con colores por estado)
  - Top 10 Materiales por Valor (Horizontal Bar)
  - Materiales por Ubicación (Bar Chart)
  - Distribución de Precios (Area Chart)
  - Eficiencia de Stock por Categoría (Radar Chart)

- **Métricas Inteligentes**:
  - Valor Promedio por Unidad
  - Salud del Inventario (%)
  - Categorías y Marcas Activas
  - Ubicaciones de Almacenamiento
  - Material Más Valioso
  - Análisis de Rotación Lenta

- **Alertas Automáticas**:
  - Identificación de materiales críticos (stock bajo + alto valor)
  - Top 5 materiales que requieren atención inmediata
  - Materiales con exceso de stock (>30 días sin movimiento)

### Gestión de Proyectos
- **Múltiples Proyectos**: Maneja varios proyectos de forma independiente
- **Cambio Rápido**: Alterna entre proyectos con un clic
- **Dashboard Individual**: Cada proyecto tiene su propio dashboard y analytics

### Gestión de Materiales
- **Campos Requeridos**: Nombre, Categoría, Ubicación
- **Campos Opcionales**: Descripción, Marca, Color, Tamaño, Medidas, Unidad, Cantidad, Precio Mínimo, Precio, Proveedor, Notas
- **Categorías Predefinidas**: Cemento, Ladrillos, Acero, Madera, Pinturas, Plomería, Eléctrico, Herramientas, etc.

### Control de Inventario
- **Gestión de Cantidades**: Agregar/substraer stock con validación
- **Alertas de Stock Mínimo**: Monitoreo de niveles críticos
- **Historial de Cambios**: Timestamps de creación y última actualización

### Importación y Exportación
- **Formatos Soportados**:
  - Excel (.xlsx, .xls)
  - CSV (.csv)
  - JSON (.json)
- **Validación de Datos**: Verificación de campos requeridos
- **Opciones de Importación**: Reemplazar existentes o agregar nuevos

## 🎯 Casos de Uso

### Para Empresas Constructoras
- Control de materiales en obra
- Seguimiento de proveedores
- Gestión de costos de inventario
- Reportes para contabilidad

### Para Almacenes de Materiales
- Control de stock en tiempo real
- Alertas de reposición
- Trazabilidad de productos
- Gestión de ubicaciones

### Para Proyectos de Construcción
- Inventario por proyecto
- Control de presupuestos
- Seguimiento de materiales utilizados
- Planificación de compras

## �� Características de la Interfaz

- **Diseño Responsivo**: Adaptable a móviles, tablets y desktop
- **Tema Moderno**: Interfaz limpia con Tailwind CSS
- **Navegación Intuitiva**: Panel lateral para formularios, vista principal para listas
- **Feedback Visual**: Mensajes de éxito/error, confirmaciones de acciones
- **Accesibilidad**: Controles claros y navegación por teclado

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno si es necesario
3. Desplegar automáticamente en cada push

### Otros Proveedores
- **Netlify**: Compatible con aplicaciones Next.js
- **Railway**: Despliegue simple con Git
- **AWS Amplify**: Para entornos empresariales

## �� Roadmap

- [ ] Autenticación de usuarios
- [ ] Base de datos persistente (PostgreSQL/MongoDB)
- [ ] API REST para integraciones
- [ ] Aplicación móvil nativa
- [ ] Reportes avanzados y gráficos
- [ ] Integración con sistemas ERP
- [ ] Notificaciones push para stock bajo
- [ ] Escaneo de códigos de barras/QR
- [ ] Optimización de rendimiento

**Desarrollado por OcreamerStudio**

## 📖 Documentación Adicional

- **[DASHBOARD_FEATURES.md](./DASHBOARD_FEATURES.md)**: Descripción técnica completa del dashboard
- **[DASHBOARD_USAGE_GUIDE.md](./DASHBOARD_USAGE_GUIDE.md)**: Guía de uso del dashboard para usuarios

## 🎯 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📦🚀 Estructura de Archivo Excel

El orden de las casillas en el archivo Excel es el siguiente:

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

    