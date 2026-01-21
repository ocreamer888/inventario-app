# Dashboard de Analytics - Inventario App

## Descripción General

El nuevo dashboard centraliza toda la información de cada proyecto con gráficos interactivos y análisis detallados. Proporciona insights valiosos sobre el estado del inventario, distribución de materiales y eficiencia de stock.

## Características Principales

### 1. **Tres Modos de Vista**

El dashboard ofrece tres vistas diferentes según las necesidades del usuario:

#### Vista de Resumen (Overview)
- Estadísticas básicas del inventario
- Métricas avanzadas y KPIs
- Alertas de materiales críticos

#### Vista de Análisis Avanzado
- Métricas detalladas de rendimiento
- Indicadores de salud del inventario
- Análisis de rotación de stock

#### Vista de Gráficos Detallados
- Gráficos interactivos con Recharts
- Visualización de datos por múltiples dimensiones
- Análisis comparativo de categorías

### 2. **Métricas y Estadísticas**

#### Estadísticas Básicas
- **Total de Materiales**: Conteo de ítems en inventario
- **Valor Total**: Suma del valor monetario del inventario
- **Stock Bajo**: Materiales que alcanzaron el stock mínimo
- **Sin Stock**: Materiales agotados

#### Estadísticas Avanzadas
- **Valor Promedio**: Precio promedio por unidad
- **Salud del Inventario**: Porcentaje de materiales con stock adecuado
- **Categorías Activas**: Número de categorías y marcas
- **Ubicaciones**: Puntos de almacenamiento utilizados

### 3. **Gráficos Interactivos**

#### Distribución por Categoría (Pie Chart)
Muestra la proporción de materiales por categoría con porcentajes.

#### Valor Total por Categoría (Bar Chart)
Visualiza el valor monetario total invertido en cada categoría.

#### Estado de Inventario (Pie Chart)
Distribución visual de materiales según su estado:
- Stock Normal (verde)
- Stock Bajo (amarillo)
- Sin Stock (rojo)

#### Top 10 Materiales por Valor (Horizontal Bar Chart)
Identifica los materiales más valiosos del inventario.

#### Materiales por Ubicación (Bar Chart)
Muestra la distribución de materiales por ubicación de almacenamiento.

#### Distribución de Precios (Area Chart)
Análisis de la distribución de materiales según rangos de precio:
- $0-50
- $51-100
- $101-200
- $201-500
- $500+

#### Eficiencia de Stock por Categoría (Radar Chart)
Compara el stock actual vs. stock mínimo requerido por categoría, mostrando qué categorías están sobreabastecidas o necesitan reabastecimiento.

### 4. **Alertas Inteligentes**

#### Materiales que Requieren Atención
Panel dedicado que muestra los 5 materiales más críticos:
- Con stock bajo o agotado
- De alto valor
- Información de ubicación y categoría
- Estado actual vs. stock mínimo

### 5. **Insights Rápidos**

Tres tarjetas destacadas con información clave:

1. **Material Más Valioso**: Identifica el material con mayor valor en inventario
2. **Total en Inventario**: Suma de todas las unidades
3. **Rotación Lenta**: Materiales con exceso de stock (más de 30 días sin actualizar)

## Tecnologías Utilizadas

- **React 19**: Framework principal
- **Next.js 16**: Framework de aplicación
- **Recharts**: Biblioteca de gráficos interactivos
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos y diseño responsive
- **Lucide React**: Iconos modernos

## Componentes Creados

### `ProjectDashboard.tsx`
Componente principal que integra todas las vistas del dashboard.

### `DashboardCharts.tsx`
Contiene todos los gráficos interactivos usando Recharts.

### `AdvancedStats.tsx`
Muestra estadísticas avanzadas, KPIs y alertas críticas.

### `MaterialStats.tsx` (Actualizado)
Estadísticas básicas existentes integradas en el dashboard.

## Navegación

El usuario puede alternar entre dos modos principales:

1. **Dashboard**: Vista de análisis y gráficos
2. **Gestión de Materiales**: Vista tradicional para agregar/editar materiales

## Diseño Responsive

Todos los componentes están optimizados para:
- 📱 Móviles
- 📱 Tablets
- 🖥️ Escritorio
- 🖥️ Pantallas grandes

Los gráficos se adaptan automáticamente al tamaño de pantalla usando `ResponsiveContainer` de Recharts.

## Beneficios

1. **Visibilidad Total**: Vista completa del estado del inventario
2. **Toma de Decisiones**: Datos visuales para decisiones informadas
3. **Identificación Rápida**: Detecta problemas de stock inmediatamente
4. **Análisis Profundo**: Entiende patrones y tendencias
5. **Eficiencia**: Optimiza el manejo de inventario
6. **Profesionalismo**: Presentación visual de datos de calidad

## Próximas Mejoras Sugeridas

- [ ] Exportar gráficos como imágenes
- [ ] Filtros de fecha para análisis temporal
- [ ] Comparación entre proyectos
- [ ] Predicción de necesidades de reabastecimiento
- [ ] Gráficos de tendencias históricas
- [ ] Dashboard personalizable (drag & drop)
- [ ] Integración con alertas por email
- [ ] Reportes PDF automatizados
