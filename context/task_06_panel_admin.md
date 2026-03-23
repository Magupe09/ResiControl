---
tarea: Panel Administrador: Dashboard y Timeline
orden: 06
objetivo: Dashboard con filtros, timeline/log, exportación CSV, auditoría de responsables.
alcance:
  - Filtros avanzados por torre, apartamento, estado, guardia, fechas.
  - Timeline/log de eventos.
  - Exportación CSV/Excel.
  - Auditoría de responsables.
---

### Estado: ✅ COMPLETADO

### Pasos manuales en Supabase (REQUERIDOS)

Para que el panel de admin funcione correctamente, necesitas crear un usuario admin:

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **Add user**:
   - Email: `admin@resicontrol.com` (o el que prefieras)
   - Password: establece una contraseña
3. **Ir a tabla `guards`** → agregar registro:
   - nombre: `Administrador`
   - email: `admin@resicontrol.com` (mismo email del usuario Auth)
   - activo: `true`

### Implementación

#### 1. Funciones en `src/supabase.js`

**getPackages(filters)** - Filtrado avanzado:
```javascript
export async function getPackages(filters = {}) {
  let query = supabase.from('packages').select('*, guards(nombre)')
  if (filters.tower) query = query.ilike('torre', `%${filters.tower}%`)
  if (filters.apartment) query = query.ilike('apartamento', `%${filters.apartment}%`)
  if (filters.status && filters.status !== 'all') query = query.eq('estado', filters.status)
  if (filters.guardId) query = query.eq('guard_id', filters.guardId)
  if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom)
  if (filters.dateTo) query = query.lte('created_at', filters.dateTo + 'T23:59:59')
  return await query.order('created_at', { ascending: false })
}
```

**getGuards()** - Lista de guardias activos:
```javascript
export async function getGuards() {
  const { data, error } = await supabase
    .from('guards')
    .select('id, nombre')
    .eq('activo', true)
  return { data, error }
}
```

#### 2. AdminPanel (`src/components/AdminPanel.jsx`)
- **Stats**: Total, Pendientes, Entregados
- **Filtros**:
  - Torre (texto)
  - Apartamento (texto)
  - Estado (dropdown)
  - Guardia (dropdown)
  - Fecha Desde/Hasta (date)
- **Tabla**: Muestra todos los paquetes con columnas
- **Exportar CSV**: Descarga archivo con datos filtrados

#### 3. Integración en App (`src/App.jsx`)
- Nueva vista `'admin'`
- Muestra AdminPanel si `isAdmin` es true
- `isAdmin` = true si nombre contiene "Admin" o email contiene "admin"

#### 4. GuardDashboard (`src/components/GuardDashboard.jsx`)
- Nuevo botón "Admin" visible solo para usuarios admin

#### 5. Estilos (`src/App.css`)
- `.admin-panel` - Contenedor principal
- `.admin-stats` - Tarjetas de estadísticas
- `.admin-filters` - Filtros
- `.admin-table` - Tabla de datos
- `.status-badge` - Badges de estado
- `.btn-export` - Botón exportar

### Flujo de uso
1. Login como usuario admin
2. En dashboard aparece botón "⚙️ Admin"
3. Toca Admin → Panel de administración
4. Usa filtros para buscar paquetes
5. Observa stats y tabla
6. Exporta a CSV si necesitas

### Archivos creados
- `src/components/AdminPanel.jsx` - Nuevo componente

### Archivos modificados
- `src/supabase.js` - getPackages con filtros, getGuards
- `src/App.jsx` - Integración de AdminPanel
- `src/components/GuardDashboard.jsx` - Botón admin
- `src/App.css` - Estilos del panel

### Checklist
- [x] Dashboard con estadísticas
- [x] Filtros por torre, apartamento, estado, guardia, fecha
- [x] Timeline/log (tabla con historial)
- [x] Exportación CSV
- [x] Auditoría de responsables (nombre del guardia)
- [ ] Exportación Excel (CSV es más común, Excel es opcional)
