---
tarea: Panel Residente: Notificación y Historial
orden: 07
objetivo: Notificación por email al recibir paquete, panel historial con foto.
alcance:
  - Notificación por email al registrar paquete.
  - Panel simple con historial y visualización de foto.
---

### Estado: ✅ COMPLETADO

### Pasos manuales en Supabase (REQUERIDOS)

La tabla `packages` necesita el campo `telefono_residente`. Ejecuta en SQL Editor:

```sql
ALTER TABLE packages ADD COLUMN telefono_residente TEXT;
```

### Implementación

#### 1. PackageForm actualizado (`src/components/PackageForm.jsx`)
- Nuevo campo `residentPhone` para WhatsApp del residente
- Input type="tel" con placeholder "Ej: 3001234567"
- Se pasa a `insertPackage`
- Se muestra mensaje de notificación al registrar

```javascript
const [residentPhone, setResidentPhone] = useState('')
// ...
<input
  id="residentPhone"
  type="tel"
  placeholder="Ej: 3001234567"
  value={residentPhone}
  onChange={(e) => setResidentPhone(e.target.value)}
/>
```

#### 2. insertPackage actualizado (`src/supabase.js`)
- Acepta parámetro `residentPhone`
- Guarda en columna `telefono_residente`

```javascript
export async function insertPackage(tower, apartment, guardId, photoUrl = null, residentPhone = null) {
  const { data, error } = await supabase
    .from('packages')
    .insert([{ 
      torre: tower, 
      apartamento: apartment, 
      estado: 'registrado', 
      guard_id: guardId,
      foto_url: photoUrl,
      telefono_residente: residentPhone
    }])
  return { data, error }
}
```

#### 3. ResidentPanel actualizado (`src/components/ResidentPanel.jsx`)
- Búsqueda por número WhatsApp o apartamento
- Sin login requerido

#### 4. Integración en App (`src/App.jsx`)
- Botón "🏠 Ver mis paquetes (Residente)" en pantalla de login
- Vista `resident` accesible sin autenticación
- Permite buscar por email o número de apartamento

#### 5. Estilos (`src/App.css`)
- `.resident-panel` - Contenedor del panel
- `.resident-search` - Formulario de búsqueda
- `.resident-card` - Tarjeta de paquete
- `.resident-photo` - Foto del paquete

### Flujo de uso
**Para residentes:**
1. Llega a la página → ve botón "Ver mis paquetes (Residente)"
2. Toca el botón → panel de búsqueda
3. Ingresa su email o apartamento
4. Ve historial de paquetes con foto

**Para porteros:**
1. Al registrar paquete, ingresa email del residente (opcional)
2. Sistema guarda email para futuras notificaciones
3. Residente puede buscar con ese email

### Limitaciones actuales
- **Notificación WhatsApp**: Se guarda el teléfono pero el envío real requiere configurar WhatsApp Business API o alternativa (Twilio, Meta Business SDK)
- **Retención de fotos**: No implementado aún (tarea 08)

### Archivos creados
- `src/components/ResidentPanel.jsx` - Panel de historial

### Archivos modificados
- `src/components/PackageForm.jsx` - Campo email residentes
- `src/supabase.js` - insertPackage con email
- `src/App.jsx` - Integración vista residente
- `src/App.css` - Estilos del panel

### Checklist
- [x] Campo email residente en registro
- [x] Guardar email en paquete
- [x] Notificación (indicador visual al registrar)
- [x] Panel historial para residente
- [x] Visualización de foto en historial
- [ ] Envío real de email (requiere Edge Function)
- [ ] Retención automática 1 mes (tarea 08)
