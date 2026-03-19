---
tarea: Modelado de Datos: Guards y Packages
orden: 01
objetivo: Definir y crear el esquema de datos en Supabase (guards y packages).
alcance:
  - Tablas de guards y packages.
  - Relaciones correctas (FKs).
  - Campos mínimos para MVP.
ejecucion:
  - Crear tabla guards (id UUID, nombre, activo, email/tel, timestamps).
  - Crear tabla packages (id UUID, torre, apto, estado, guard_id (FK), fechas, receptor, foto).
  - Definir indices, claves foráneas, y soft delete.
  - Probar creación e integridad en Supabase.
  - Validar con consulta simple.
---

### ¿Qué requisitos debe cumplir la tarea?
- Tablas: guards y packages
- Relaciones entre ambas (guard_id como FK en packages)
- Campos obligatorios para MVP
- Índices y soft delete
- Prueba de integridad

### Estado final de la tarea
- Tabla guards creada (id UUID, nombre, activo, email/tel, timestamps).
- Tabla packages creada (id UUID, torre, apartamento, estado, guard_id (FK), fechas, receptor, foto).
- Soft delete implementado y validado (deleted_at).
- Índices creados (apartamento, estado, guard_id, deleted_at).
- Integridad referencial probada y funcional (consultas y joins OK).
- Datos previos eliminados.

#### Checklist
- [x] Revisar estructura existente (package)
- [x] Definir campos mínimos/relaciones
- [x] Preparar SQL de creación/migración
- [x] Crear soft delete
- [x] Crear índices
- [x] Pruebas de integridad
- [x] Documentación en este archivo

**Tarea 1 completada: modelo inicial de guards y packages implementado, probado, y listo para siguientes pasos.**
