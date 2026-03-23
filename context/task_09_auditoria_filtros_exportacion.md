---
tarea: Auditoría, Filtros y Exportación
orden: 09
objetivo: Panel de paquetes perdidos/no entregados, filtros avanzados, exportación CSV/Excel.
alcance:
  - Panel para paquetes perdidos/no entregados.
  - Filtros por apartamento, torre, guardia, receptor, fechas.
  - Exportación CSV y Excel.
---

### Estado: ✅ COMPLETADO

### Pasos manuales en Supabase (REQUERIDOS)

La tabla `packages` necesita la columna `telefono_residente`. Ejecuta en SQL Editor:

```sql
ALTER TABLE packages ADD COLUMN telefono_residente TEXT;
```

### Implementación

#### 1. AdminPanel mejorado (`src/components/AdminPanel.jsx`)

**Nuevas funcionalidades:**

- **Estadística de paquetes sin entrega**: Muestra count de paquetes pendientes por más de X días
- **Filtro de paquetes perdidos**: Checkbox para filtrar paquetes sin entregar por más de X días
- **Filtros avanzados**:
  - Torre (texto)
  - Apartamento (texto)
  - Estado (dropdown)
  - Guardia (dropdown)
  - Fecha Desde/Hasta
  - Filtro "Paquetes sin entregar por más de X días"

- **Exportación doble**:
  - **CSV**: Compatible con Excel, Google Sheets
  - **Excel (.xls)**: Formato nativo de Excel

```javascript
// Filtros actualizados
const [filters, setFilters] = useState({
  tower: '',
  apartment: '',
  status: 'all',
  guardId: '',
  dateFrom: '',
  dateTo: '',
  lost: false,      // nuevo: filtro de perdidos
  oldDays: 7        // nuevo: días para considerar perdido
})
```

#### 2. getPackages actualizado (`src/supabase.js`)
- Filtro de paquetes perdidos se aplica client-side (después de obtener datos)
- Calcula días desde `created_at` y filtra los pendientes mayores a X días

```javascript
if (filters.lost && filters.oldDays) {
  packages = packages.filter(p => {
    if (p.estado !== 'registrado') return false
    const daysOld = (now - new Date(p.created_at)) / (1000 * 60 * 60 * 24)
    return daysOld > filters.oldDays
  })
}
```

#### 3. Exportación mejorada

**CSV**: Ahora incluye escape de comillas y más campos:
- ID, Torre, Apartamento, Estado, Guardia, Receptor, Teléfono, Fecha Registro, Fecha Entrega, Foto URL

**Excel**: Genera HTML con formato table que Excel puede abrir directamente

### Flujo de uso
1. Login como admin
2. Ir a Panel Admin
3. Ver estadísticas completas incluyendo "Sin entrega"
4. Usar filtros para análisis
5. Filtros "Paquetes sin entregar" para ver pendientes viejos
6. Exportar a CSV o Excel para reportes

### Archivos modificados
- `src/components/AdminPanel.jsx` - Filtros, estadísticas, exportación
- `src/supabase.js` - getPackages con filtro de perdidos
- `src/App.css` - Estilos para filtros y botones

### Checklist
- [x] Panel de paquetes perdidos/no entregados
- [x] Filtros por apartamento, torre, guardia, receptor, fechas
- [x] Exportación CSV
- [x] Exportación Excel
- [x] Estadísticas de paquetes sin entrega
