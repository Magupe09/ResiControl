---
tarea: Registro de Paquete con Foto
orden: 04
objetivo: Formulario con torre, apartamento y foto. Foto en Storage (1 mes), datos en packages (3 meses).
alcance:
  - Formulario con torre, apto y captura de foto.
  - Guardar foto en Supabase Storage (retención 1 mes).
  - Guardar datos en la tabla packages (retención 3 meses).
---

### Estado: ✅ COMPLETADO

### Pasos manuales en Supabase (REQUERIDOS)

El bucket de storage debe crearse manualmente en el Dashboard:

1. **Ir a Supabase Dashboard** → **Storage**
2. **Click "New bucket"**
3. **Configurar:**
   - Bucket name: `paquetes-fotos`
   - Public: ✅ Marcar "Public"
   - File size limit: `5` (MB)
   - Allowed mime types: `image/jpeg`, `image/png`, `image/webp`
4. **Click "Save"**

### Implementación

#### 1. Funciones en `src/supabase.js`

**uploadPhoto(file)** - Sube imagen a Storage:
```javascript
export async function uploadPhoto(file) {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('paquetes-fotos')
    .upload(fileName, file)
  if (error) return { data: null, error }
  
  const { data: urlData } = supabase.storage
    .from('paquetes-fotos')
    .getPublicUrl(fileName)
  
  return { data: urlData.publicUrl, error: null }
}
```

**insertPackage()** - Actualizado para aceptar photoUrl:
```javascript
export async function insertPackage(tower, apartment, guardId, photoUrl = null) {
  // Guarda foto_url en la tabla packages
}
```

#### 2. PackageForm (`src/components/PackageForm.jsx`)
- Input de archivo con `capture="environment"` para abrir cámara
- Preview de foto antes de registrar
- Botón para quitar foto
- Si falla upload, registra paquete sin foto (no bloquea)

#### 3. PackageCard (`src/components/PackageCard.jsx`)
- Muestra foto del paquete si existe
- Imagen con `object-fit: cover`, max-height 150px

#### 4. Estilos (`src/App.css`)
- `.btn-photo` - Botón para agregar foto
- `.photo-preview` - Vista previa de imagen
- `.btn-remove-photo` - Botón para eliminar
- `.card-photo` - Estilo para foto en tarjeta

### Flujo de uso
1. Portero toca "Recibir" → Formulario
2. Ingresa torre y apartamento
3. Opcional: toca "📷 Agregar foto" → abre cámara
4. Previsualiza foto → puede quitar o proceder
5. Toca "Registrar Paquete"
6. Foto se sube a Storage, URL se guarda en tabla packages

### Retención (pendiente de implementar en tarea 08)
- Fotos: eliminar después de 1 mes
- Datos de paquetes: eliminar después de 3 meses

### Archivos modificados
- `src/supabase.js` - Agregadas funciones uploadPhoto e insertPackage actualizada
- `src/components/PackageForm.jsx` - Input de cámara y preview
- `src/components/PackageCard.jsx` - Muestra foto en lista
- `src/App.css` - Estilos para fotos

### Checklist
- [x] Formulario con torre, apartamento
- [x] Input de cámara/foto
- [x] Preview de foto
- [x] Subir a Supabase Storage
- [x] Guardar URL en paquete
- [x] Mostrar foto en lista
- [ ] Retención automática (tarea 08)
