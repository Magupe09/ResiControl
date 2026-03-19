# Portex — Implementación Paso a Paso

## Objetivo General
Plataforma moderna para gestión, trazabilidad y notificación de correspondencia en conjuntos residenciales, Bogotá.

---

## Tareas del Sistema (Ejecución Modular por Modelos Menores)

### 01. Modelado de Datos: Guards y Packages
- Crear tablas `guards` (id, nombre, activo, email/tel) y `packages` (id, torre, apto, estado, guard_id, fechas, receptor, foto).
- Definir relaciones.
- **Éxito:** Tablas y relaciones listas en Supabase, sin error.

---

### 02. Autenticación Portero (Guard Login)
- Implementar login por ID/código.
- Mostrar nombre del portero en UI.
- **Éxito:** Login funcional, nombre visible, sesión persistente.

---

### 03. Pantalla Portero: Recibir y Entregar
- UI mobile: botones grandes "Recibir" y "Entregar", nombre del portero.
- Navegación intuitiva.
- **Éxito:** Pantalla funcional, navegación simple.

---

### 04. Registro de Paquete con Foto
- Formulario torre, apto, input/cámara para foto.
- Foto guardada en Supabase Storage (1 mes), datos en packages (3 meses).
- **Éxito:** Paquete y foto visibles, link funcional.

---

### 05. Entrega de Paquete: Filtrado y Confirmación
- Lista filtrada de paquetes pendientes por apto.
- Botón para marcar como entregado, registro de entrega/firma/foto opcional.
- **Éxito:** Filtrado, actualización de estado.

---

### 06. Panel Administrador: Dashboard y Timeline
- Dashboard con filtros, timeline/log, exportación.
- Auditoría de responsables.
- **Éxito:** Admin puede filtrar, ver todo el ciclo, exportar.

---

### 07. Panel Residente: Notificación y Historial
- Notificación (email/SMS/WhatsApp) cuando llega paquete.
- Panel simple: historial visualiza foto (1 mes).
- **Éxito:** Notificación automática, historial funcional.

---

### 08. Retención Automática: Fotos y Datos
- Script/serverless para borrar fotos viejas (1 mes), datos viejos (3 meses).
- **Éxito:** Retención y limpieza comprobada.

---

### 09. Auditoría, Filtros y Exportación
- Panel de paquetes perdidos/no entregados.
- Filtros por apto, torre, guard, receptor, fechas.
- Exportación a CSV/Excel.
- **Éxito:** Auditoría y exportación completadas.

---

### 10. Pruebas UX y Revisión Privacidad
- Tests en dispositivos reales, revisión legal de foto/retención.
- Documentar permisos y políticas.
- **Éxito:** UX validada, privacidad documentada.

---

Todos los pasos están definidos para ejecución modular (modelo menor).
