# Guía de Uso del Dashboard de Analytics

## Resumen

Se ha implementado exitosamente un dashboard completo con gráficos interactivos y análisis detallados para tu aplicación de inventario. El dashboard centraliza toda la información de cada proyecto con visualizaciones profesionales.

## Cómo Acceder al Dashboard

1. **Inicia sesión** en la aplicación
2. **Selecciona un proyecto** de la lista de proyectos disponibles
3. **Haz clic en el botón "Dashboard"** en el toggle principal (está activado por defecto)

## Vistas Disponibles

### 1. Vista de Resumen
Muestra una combinación de:
- **Estadísticas básicas** (Total materiales, Valor total, Stock bajo, Sin stock)
- **Métricas avanzadas** (Valor promedio, Salud del inventario, Categorías activas, Ubicaciones)
- **Quick Insights** (Material más valioso, Total unidades, Rotación lenta)
- **Alertas críticas** (Top 5 materiales que requieren atención)

### 2. Vista de Análisis Avanzado
Se enfoca en:
- **KPIs principales** con iconos coloridos
- **Análisis de salud del inventario**
- **Distribución por marcas y categorías**
- **Identificación de materiales críticos**
- **Análisis de rotación de stock**

### 3. Vista de Gráficos Detallados
Incluye:
- **Estadísticas básicas** en tarjetas
- **8 gráficos interactivos** con Recharts:
  - Distribución por Categoría (Pie Chart)
  - Valor Total por Categoría (Bar Chart)
  - Estado de Inventario (Pie Chart)
  - Top 10 Materiales por Valor (Horizontal Bar)
  - Materiales por Ubicación (Bar Chart)
  - Distribución de Precios (Area Chart)
  - Eficiencia de Stock por Categoría (Radar Chart)

## Navegación

### Toggle Principal
Usa el toggle en la parte superior para alternar entre:
- 🎯 **Dashboard** → Ver análisis y gráficos
- 📦 **Gestión de Materiales** → Agregar/editar materiales

### Tabs del Dashboard
Dentro del dashboard, puedes cambiar entre:
- 👁️ **Resumen** → Vista general combinada
- 📈 **Análisis Avanzado** → Métricas detalladas
- 📊 **Gráficos Detallados** → Visualizaciones completas

## Características de los Gráficos

### Interactividad
- **Hover**: Pasa el mouse sobre cualquier elemento del gráfico para ver detalles
- **Tooltips**: Información contextual al pasar el mouse
- **Leyendas**: Identificación clara de cada serie de datos
- **Responsive**: Se adaptan automáticamente al tamaño de pantalla

### Tipos de Gráficos

1. **Pie Charts**: Para distribuciones porcentuales
2. **Bar Charts**: Para comparaciones entre categorías
3. **Area Charts**: Para distribuciones continuas
4. **Radar Charts**: Para análisis multidimensional

## Métricas Explicadas

### Estadísticas Básicas

- **Total Materiales**: Número total de ítems en el inventario
- **Valor Total**: Suma de (cantidad × precio) de todos los materiales
- **Stock Bajo**: Materiales con cantidad ≤ cantidad mínima
- **Sin Stock**: Materiales con cantidad = 0

### Estadísticas Avanzadas

- **Valor Promedio**: Precio promedio por unidad de material
- **Salud del Inventario**: % de materiales con stock adecuado (>70% es bueno)
- **Categorías Activas**: Número de categorías diferentes en uso
- **Ubicaciones**: Cantidad de puntos de almacenamiento utilizados

### Insights Automáticos

- **Material Más Valioso**: El material con mayor valor total (cantidad × precio)
- **Total en Inventario**: Suma de todas las unidades de todos los materiales
- **Rotación Lenta**: Materiales sin actualizar por >30 días y con exceso de stock

## Alertas Inteligentes

El sistema automáticamente identifica **Materiales que Requieren Atención**:
- Stock bajo o agotado
- Alto valor monetario
- Necesitan reabastecimiento urgente

Se muestran los 5 más críticos con:
- Nombre y categoría
- Ubicación
- Stock actual vs. stock mínimo
- Valor total del material

## Consejos de Uso

### Para Aprovechar al Máximo el Dashboard

1. **Mantén datos actualizados**: El dashboard se actualiza en tiempo real con tus cambios
2. **Revisa regularmente**: Especialmente la vista de Análisis Avanzado
3. **Atiende las alertas**: Los materiales críticos requieren acción inmediata
4. **Usa las vistas según tu necesidad**:
   - Resumen → Para una vista rápida diaria
   - Análisis → Para decisiones de compra/reabastecimiento
   - Gráficos → Para presentaciones o análisis profundo

### Flujo de Trabajo Recomendado

1. **Inicio del día**: Revisa la vista de Resumen
2. **Planificación**: Usa Análisis Avanzado para identificar necesidades
3. **Gestión**: Cambia a "Gestión de Materiales" para hacer ajustes
4. **Reportes**: Usa Gráficos Detallados para documentación

## Datos de Ejemplo

Para ver el dashboard con datos completos:
1. Ve a "Gestión de Materiales"
2. Agrega algunos materiales de prueba con diferentes:
   - Categorías
   - Ubicaciones
   - Precios
   - Cantidades
3. Regresa al Dashboard para ver los gráficos poblados

## Compatibilidad

El dashboard funciona en:
- ✅ Chrome, Firefox, Safari, Edge (últimas versiones)
- ✅ Tablets y iPads
- ✅ Pantallas móviles (diseño responsive)
- ✅ Monitores 4K y pantallas grandes

## Exportación de Datos

Los datos se pueden exportar desde "Gestión de Materiales" en:
- 📊 Excel (.xlsx)
- 📄 CSV (.csv)
- 🔧 JSON (.json)

Estos archivos pueden usarse para:
- Análisis externo
- Backup de datos
- Compartir con equipo
- Importar en otros sistemas

## Preguntas Frecuentes

### ¿Por qué los gráficos están vacíos?
R: Necesitas agregar materiales al proyecto primero. Ve a "Gestión de Materiales" y agrega algunos ítems.

### ¿Se guardan los datos?
R: Sí, todos los datos se guardan automáticamente en el almacenamiento local del navegador.

### ¿Puedo tener múltiples proyectos?
R: Sí, cada proyecto tiene su propio dashboard independiente.

### ¿Los gráficos se actualizan automáticamente?
R: Sí, cualquier cambio que hagas en los materiales se refleja inmediatamente en el dashboard.

### ¿Puedo exportar los gráficos?
R: Actualmente puedes tomar screenshots. La exportación directa de gráficos está en la lista de mejoras futuras.

## Próximas Mejoras Planificadas

- [ ] Exportar gráficos como imágenes PNG/SVG
- [ ] Filtros de fecha para análisis temporal
- [ ] Comparación entre múltiples proyectos
- [ ] Predicciones de reabastecimiento con IA
- [ ] Gráficos de tendencias históricas
- [ ] Dashboard personalizable (drag & drop)
- [ ] Reportes PDF automatizados
- [ ] Alertas por email/notificaciones

## Soporte

Si encuentras algún problema:
1. Refresca la página (F5)
2. Verifica que tengas materiales en el proyecto
3. Revisa la consola del navegador (F12)
4. Asegúrate de usar un navegador moderno

---

**Versión del Dashboard**: 1.0.0  
**Última actualización**: Enero 2026  
**Desarrollado con**: React 19, Next.js 16, Recharts, TypeScript, Tailwind CSS
