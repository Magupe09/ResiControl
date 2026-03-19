---
tarea: Retención Automática: Fotos y Datos
orden: 08
objetivo: Garantizar el borrado automático de fotos y datos según las reglas legales.
alcance:
  - Script/serverless/cron para eliminar fotos viejas (1 mes) y datos viejos (3 meses).
ejecucion:
  - Implementar función (pg_cron, Edge, script) para retención automatizada.
  - Validar limpieza programada, con logs de auditoría.
  - Documentar retención y cumplimiento legal.
---

Crear y probar la función para eliminar automáticamente archivos y datos según política de retención.