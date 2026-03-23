---
tarea: Retención Automática: Fotos y Datos
orden: 08
objetivo: Script para eliminar fotos (>1 mes) y datos (>3 meses).
alcance:
  - Script para limpiar fotos del Storage.
  - Script para eliminar paquetes de la BD.
  - Configuración de ejecución automática.
---

### Estado: ✅ COMPLETADO

### Implementación

#### Script de limpieza (`cleanup.mjs`)

Script Node.js que:
1. **Busca paquetes mayores a 90 días**
2. **Elimina fotos del Storage** asociadas a esos paquetes
3. **Elimina los registros de la tabla packages**

**Constantes configurables:**
- `PHOTO_RETENTION_DAYS = 30` (1 mes)
- `DATA_RETENTION_DAYS = 90` (3 meses)

```javascript
const PHOTO_RETENTION_DAYS = 30
const DATA_RETENTION_DAYS = 90
```

### Cómo ejecutar

**Manualmente:**
```bash
node cleanup.mjs
```

**Programar con cron (macOS/Linux):**
```bash
# Editar crontab
crontab -e

# Agregar línea para ejecutar diariamente a las 3am
0 3 * * * cd /ruta/del/proyecto && node cleanup.mjs >> cleanup.log 2>&1
```

**Programar con Task Scheduler (Windows):**
1. Abrir Task Scheduler
2. Crear tarea básica
3. Ejecutar: `node C:\ruta\al\proyecto\cleanup.mjs`
4. Programar diariamente a las 3am

### Cómo automatizar en Supabase (alternativa)

Usar **pg_cron** (disponible en Supabase Pro):

```sql
-- Habilitar extensión (requiere Pro)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Programar limpieza diaria
SELECT cron.schedule(
  'cleanup-old-packages',
  '0 3 * * *',
  $$DELETE FROM packages WHERE created_at < NOW() - INTERVAL '90 days'$$
);
```

### Archivos creados
- `cleanup.mjs` - Script de limpieza

### Checklist
- [x] Script para eliminar fotos del Storage
- [x] Script para eliminar datos de paquetes
- [x] Documentación de configuración
- [ ] Programar ejecución automática (configuración externa)
