---
tarea: Entrega de Paquete: Filtrado y Confirmación
orden: 05
objetivo: Lista filtrada por apartamento, botón entregar, registro de receptor y fecha.
alcance:
  - Listado filtrado por apartamento/torre.
  - Botón para marcar como entregado.
  - Registro de receptor y fecha de entrega.
---

### Estado: ✅ COMPLETADO

### Implementación

#### 1. Filtro de búsqueda (`src/components/PackageList.jsx`)
- Input de búsqueda en la parte superior
- Filtra por torre o apartamento
- Muestra mensaje "No hay coincidencias" si no hay resultados

```javascript
const filteredPending = filter 
  ? pending.filter(p => 
      p.apartamento.toLowerCase().includes(filter.toLowerCase()) ||
      p.torre.toLowerCase().includes(filter.toLowerCase())
    )
  : pending
```

#### 2. Formulario de entrega (`src/components/PackageCard.jsx`)
Al tocar "Marcar como Entregado":
- Muestra input para nombre de quien recibe
- Botones Confirmar y Cancelar
- Validación: requiere nombre

#### 3. Función markDelivered (`src/supabase.js`)
Actualizada para guardar:
- `estado` = 'entregado'
- `receptor` = nombre de quien recibe
- `fecha_entrega` = timestamp actual

```javascript
export async function markDelivered(id, receiverName) {
  const { data, error } = await supabase
    .from('packages')
    .update({ 
      estado: 'entregado',
      receptor: receiverName,
      fecha_entrega: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  return { data, error }
}
```

#### 4. UI de paquete entregado
- Muestra badge "Entregado" con fecha de entrega
- Muestra "Recibido por: [nombre]"
- Estilo diferenciado (verde)

#### 5. Estilos (`src/App.css`)
- `.list-filter` - Contenedor del filtro
- `.filter-input` - Input de búsqueda
- `.deliver-form` - Formulario de entrega
- `.receiver-input` - Input de nombre
- `.btn-confirm-deliver` - Botón verde de confirmar
- `.card-receiver` - Texto de quien recibió

### Flujo de uso
1. Portero toca "Entregar" → Lista de paquetes
2. Opcional: escribe en buscar para filtrar
3. Toca "Marcar como Entregado" en un paquete
4. Ingresa nombre de quien recibe
5. Toca "Confirmar Entrega"
6. Paquete se marca como entregado con receptor y fecha

### Archivos modificados
- `src/supabase.js` - markDelivered ahora acepta receiverName
- `src/components/PackageCard.jsx` - Formulario de entrega
- `src/components/PackageList.jsx` - Filtro de búsqueda
- `src/App.css` - Estilos de entrega

### Checklist
- [x] Lista filtrada por apartamento/torre
- [x] Botón para marcar como entregado
- [x] Registro de receptor (nombre)
- [x] Registro de fecha de entrega
- [ ] Foto/firma de entrega (opcional, no implementado)
